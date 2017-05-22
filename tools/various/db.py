# -*- coding: utf-8 -*-
import re
from datetime import datetime
from collections import OrderedDict

import arrow
from django.core.files import File
from django.db import models
from django.db.models import FieldDoesNotExist
from django.utils import translation
from django.utils.translation import get_language

from pytils import dt

from config.settings import LANGUAGES_TUPLE
from tools.files.fields import CustomImgField
from tools.files.models import TempFile


class Export(models.Model):
    """
    Абстрактная модель с функциональностью экспорта данных
    """

    def simple_export(self, all_langs=False, exclude=None):
        """
        Простой экспорт полей с текстом, датами, булевыми значениями, внешними ключами.
        Поля с ManyToMany и ManyToOne отношениями просто игнорируются при экспорте.
        """

        res = {}

        lang = get_language()

        for field in type(self)._meta.get_fields():
            # print field.name
            if (exclude and field.name in exclude) or field.name.startswith('noexport_'):
                continue

            try:
                value = getattr(self, field.name)
            except AttributeError:
                continue
            except ValueError as e:
                if isinstance(field, models.fields.related.ManyToManyField) and not self.id:
                    res[underscore_to_camelcase(field.name)] = []
                    continue
                raise e

            if isinstance(field, models.DateTimeField):
                res[field.name] = value.strftime("%Y-%m-%dT%H:%M:%S.%fZ") if value else None
            elif isinstance(field, models.DateField):
                res[field.name] = value.strftime("%Y-%m-%d") if value else None
            elif isinstance(field, models.TimeField):
                res[field.name] = value.strftime("%H:%M") if value else None
            elif isinstance(field, CustomImgField):
                continue
            elif isinstance(field, models.ManyToOneRel) and field.name == 'translations':
                translation_data = {}

                if all_langs:
                    for l in LANGUAGES_TUPLE:
                        processed = {}
                        try:
                            raw = self.translations.get(language_code=l).simple_export()
                        except self.translations.model.DoesNotExist:
                            continue

                        self._remove_keys(raw)

                        for key in raw:
                            processed[key + l.capitalize()] = raw.get(key)

                        translation_data.update(processed)
                else:
                    translation_data = self.translations.get(language_code=lang).simple_export()
                    self._remove_keys(translation_data)

                res.update(translation_data)
            elif isinstance(field, models.ManyToOneRel):
                # continue
                if not self.id:
                    res[underscore_to_camelcase(field.name)] = []
                else:
                    # print field.to, field.to._meta.model_name
                    res[underscore_to_camelcase(field.name)] = [rel.simple_export(exclude=[field.field.name]) if isinstance(rel, Export) else rel.id for rel in
                                                                field.related_model.objects.filter(**dict((('%s_id' % (field.field.name,), self.id),)))]
            elif isinstance(field, models.fields.related.ManyToManyField):
                order_field = None
                try:
                    order_field = field.rel.through._meta.get_field('order')
                except FieldDoesNotExist:
                    pass

                querySet = field.rel.through.objects.filter(**dict(((field.rel.related_model._meta.model_name, self.id),)))

                if order_field:
                    querySet = querySet.order_by(order_field.name)

                res[underscore_to_camelcase(field.name)] = [
                    getattr(rel, field.rel.to._meta.model_name, None).simple_export(exclude=[field.rel.related_name]) if isinstance(getattr(rel, field.rel.to._meta.model_name, None),
                                                                                                                                    Export) else getattr(rel,
                                                                                                                                                         '%s_id' % (field.rel.to._meta.model_name,),
                                                                                                                                                         None) for rel in querySet]
            elif isinstance(field, models.ManyToManyRel):
                continue
            elif isinstance(field, models.ForeignKey):
                res[underscore_to_camelcase(field.name)] = value.pk if value else None
            else:
                res[underscore_to_camelcase(field.name)] = value

        return res

    def export_front(self):
        return self.simple_export()

    @classmethod
    def export_front_all(cls, *args, **kwargs):
        limit = kwargs.pop('limit', None)
        offset = kwargs.pop('offset', None)

        query_from = offset
        query_to = limit

        if limit and offset:
            query_to = limit + offset

        export_type = kwargs.pop('export_type', '')

        export_func = 'export_front'

        if export_type:
            export_func = export_func + '_' + export_type

        items_list = cls.objects.filter(*args, **kwargs)[query_from:query_to]

        return [getattr(item, export_func)() for item in items_list]

    def export_control(self):
        return self.simple_export()

    @classmethod
    def export_control_all(cls, *args, **kwargs):
        if kwargs.get('lang'):
            lang = kwargs.pop('lang')
            translation.activate(lang)

        params = {}

        export_type = kwargs.pop('export_type', '')

        all_langs = kwargs.pop('all_langs', False)
        if all_langs:
            params['all_langs'] = all_langs

        export_func = 'export_control'
        if export_type:
            export_func = export_func + '_' + export_type

        order_by = kwargs.pop('order_by', False)

        limit = kwargs.pop('limit', None)
        offset = kwargs.pop('offset', None)

        query_from = offset
        query_to = limit

        if limit and offset:
            query_to = limit + offset

        items_list = cls.objects.filter(*args, **kwargs)[query_from:query_to]

        if order_by:
            items_list = items_list.order_by(order_by)

        return [getattr(item, export_func)(**params) for item in items_list]

    @classmethod
    def _remove_keys(cls, data):
        for key in ['languageCode', 'parent', 'id']:
            data.pop(key, None)

    class Meta:
        abstract = True


class Base(Export):
    """
    Абстрактная модель с часто используемыми методами
    """
    order = models.IntegerField(blank=True, default=0)

    @classmethod
    def import_all(cls, data, **kwargs):
        objs = []
        for item in data:
            objs.append(cls.import_item(item, **kwargs))

        return objs

    @classmethod
    def import_item(cls, data, **kwargs):
        model, temp_data = cls.simple_import(data)
        if model is None:
            return

        # cls.save_translations(temp_data, model, model.translations.model)

        model.save()

        return model

    @classmethod
    def simple_import(cls, data, model=None, user=None, preview=False):
        converted_data = {}

        if getattr(cls, 'user_permitted_fields', False) and user and not user.is_staff:
            for key, value in data.iteritems():
                if key in cls.user_permitted_fields:
                    converted_data[convert(key)] = value
        else:
            for key, value in data.iteritems():
                converted_data[convert(key)] = value

        if not model:
            obj = get_or_create(cls, converted_data, preview)
        else:
            obj = model

        if converted_data.get('removed'):
            obj.delete()
            return None, None
        obj = update(obj, converted_data)

        return obj, converted_data

    def import_image(self, data):
        if data and data.get('tempImgId'):
            temp_image = TempFile.objects.get(id=data.get('tempImgId'))
            getattr(self, data.get('imageType', 'image')).save(temp_image.file.name, File(open(temp_image.file.path, 'rb')))

    @classmethod
    def save_translations(cls, data, instance, translation_model):
        for lang in LANGUAGES_TUPLE:
            translation_data = {}

            try:
                translation_instance = instance.translations.get(language_code=lang)
            except translation_model.DoesNotExist:
                translation_instance = translation_model(language_code=lang)
                translation_instance.parent = instance
                translation_instance.save()

            for key, value in data.iteritems():
                if key.endswith('_{lang}'.format(lang=lang)):
                    translation_data[key[0:-3]] = value

            translation_instance = update(translation_instance, translation_data)

    @classmethod
    def get_dates_control(cls, date_field='date', **kwargs):
        dates = cls.objects.filter(**kwargs).datetimes(date_field, 'month', order='DESC')
        years = list(OrderedDict.fromkeys([date.year for date in dates]))
        date_list = []
        for year in years:
            months = [date.month for date in dates if date.year == year]
            date_dict = {
                'year': year,
                'months': [dict(month=month, monthName=dt.MONTH_NAMES[month - 1][1]) for month in months]
            }
            date_list.append(date_dict)
        return date_list

    class Meta:
        ordering = ('order', 'id',)
        abstract = True


FIRST_CAP_RE = re.compile('(.)([A-Z][a-z]+)')
ALL_CAP_RE = re.compile('([a-z0-9])([A-Z])')


# Конвертирует строку написанную в CamelCase (например MyVariable)
# в строку с подчеркивания (например my_variable)
def convert(name):
    s1 = FIRST_CAP_RE.sub(r'\1_\2', name)
    return ALL_CAP_RE.sub(r'\1_\2', s1).lower()


def underscore_to_camelcase(value):
    words = value.split('_')
    camel_case = ''.join(word.title() for i, word in enumerate(words))
    return camel_case[0].lower() + camel_case[1:]


def create_or_update_and_get(model_class, data):
    instance = get_or_create(model_class, data)
    return update(instance, data)


def get_or_create(model_class, data, preview=False):
    if model_class._meta.pk.name in data.keys():
        get_or_create_kwargs = {
            model_class._meta.pk.name: data.pop(model_class._meta.pk.name)
        }
    else:
        get_or_create_kwargs = {
            model_class._meta.pk.name: None
        }

    try:
        # get
        instance = model_class.objects.get(**get_or_create_kwargs)
    except model_class.DoesNotExist:
        if preview:
            get_or_create_kwargs['preview'] = True

        # create
        instance = model_class(**get_or_create_kwargs)
        instance.save()

    return instance


def update(instance, data):
    # update (or finish creating)
    for key, value in data.items():
        try:
            field = type(instance)._meta.get_field(key)
        except FieldDoesNotExist:
            continue
        if not field:
            continue
        if isinstance(field, models.ForeignKey) and hasattr(value, 'items'):
            rel_instance = get_or_create(field.rel.to, value)
            rel_instance = update(rel_instance, value)
            setattr(instance, key, rel_instance)
        elif isinstance(field, models.ForeignKey):

            if not value:
                setattr(instance, '%s_id' % (field.name,), value if field.blank else field.get_default())

            elif isinstance(value, int) or isinstance(value, long) or isinstance(value, basestring):
                setattr(instance, '%s_id' % (field.name,), value)

        elif isinstance(field, models.BooleanField):
            if value is None:
                value = field.get_default()
            setattr(instance, key, value)

        elif isinstance(field, models.DateTimeField):
            setattr(instance, key, arrow.get(value).datetime if value else None)

        elif isinstance(field, models.DateField):
            setattr(instance, key, datetime.strptime(value, "%Y-%m-%d") if value else None)

        elif isinstance(field, models.fields.related.ManyToManyField):
            through = field.rel.through
            order_field = None

            try:
                order_field = through._meta.get_field('order')
            except FieldDoesNotExist:
                pass

            through.objects.filter(**dict(((field.rel.related_model._meta.model_name, instance.pk),))).delete()

            for order, id in enumerate(value):
                id = int(id)

                values = dict((
                    ('%s_id' % (field.rel.related_model._meta.model_name,), instance.pk),
                    ('%s_id' % (field.rel.to._meta.model_name,), id),
                ))

                if order_field:
                    values[order_field.name] = order

                through(**values).save()


        else:
            if not value and getattr(field, 'blank', False):
                value = field.get_default()
            setattr(instance, key, value)
    instance.save()

    return instance


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError, 'Object of type %s with value of %s is not JSON serializable' % (type(obj), repr(obj))
