# -*- coding: utf-8 -*-

from random import randint
from django.core.urlresolvers import reverse

from django.db import models
from django.core.files import File
from django.utils.translation import ugettext_lazy as _, get_language

from tools.files.fields import CustomImgField
from tools.files.models import TempFile
from tools.various.db import convert, get_or_create, update, underscore_to_camelcase


class Export(models.Model):
    """
    Абстрактная модель с функциональностью экспорта данных
    """

    def simple_export(self):
        """
        Простой экспорт полей с текстом, датами, булевыми значениями, внешними ключами.
        Поля с ManyToMany и ManyToOne отношениями просто игнорируются при экспорте.
        """

        res = {}

        for field in type(self)._meta.get_fields():
            try:
                value = getattr(self, field.name)
            except AttributeError:
                continue

            if isinstance(field, models.DateField):
                res[field.name] = value.strftime("%Y-%m-%d") if value else None
            elif isinstance(field, models.TimeField):
                res[field.name] = value.strftime("%H:%M") if value else None
            elif isinstance(field, CustomImgField):
                continue
            elif isinstance(field, models.ManyToOneRel) and field.name == 'translations':
                translation_data = {}

                res.update(translation_data)
            elif isinstance(field, models.ManyToOneRel):
                continue
            elif isinstance(field, models.ManyToManyField):
                continue
            elif isinstance(field, models.ForeignKey):
                res[underscore_to_camelcase(field.name)] = value.pk
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

        params = {}

        export_type = kwargs.pop('export_type', '')

        export_func = 'export_control'
        if export_type:
            export_func = export_func + '_' + export_type

        items_list = cls.objects.filter(*args, **kwargs)
        return [getattr(item, export_func)(**params) for item in items_list]

    class Meta:
        abstract = True


class Base(Export):
    """
    Абстрактная модель с часто используемыми методами
    """
    order = models.IntegerField(blank=True, default=0)

    @classmethod
    def import_all(cls, data, parent=None):
        objs = []
        for item in data:
            objs.append(cls.import_item(item, parent))

        return objs

    @classmethod
    def import_item(cls, data, parent=None):
        model, temp_data = cls.simple_import(data)
        if model is None:
            return

        model.save()

        return model

    @classmethod
    def simple_import(cls, data):
        converted_data = {}

        for key, value in data.iteritems():
            converted_data[convert(key)] = value

        obj = get_or_create(cls, converted_data)
        if converted_data.get('removed'):
            obj.delete()
            return None, None
        obj = update(obj, converted_data)

        return obj, converted_data

    def import_image(self, data):
        if data.get('tempImgId'):
            temp_image = TempFile.objects.get(id=data.get('tempImgId'))
            getattr(self, data.get('imageType')).save(temp_image.file.name, File(open(temp_image.file.path, 'rb')))
        elif data.get('removed') == True:
            setattr(self, data.get('imageType'), None)

    class Meta:
        ordering = ('order', 'id',)
        abstract = True


class Card(Base):
    title = models.CharField(max_length=200, blank=True, default='', verbose_name=_(u'Card'))

    @classmethod
    def get_or_create(cls):
        try:
            obj = cls.objects.all()[0]
        except IndexError:
            obj = cls.objects.create()

        return obj

    def export_control(self):
        data = {}

        data.update({
            'id': self.id,
            'title': self.title,
            # 'url': self.get_control_url()
        })

        return data

    def export_front(self):
        data = {}

        data.update({
            'id': self.id,
            'title': self.title,
            # 'url': self.get_control_url()
        })

        return data

    # def get_control_url(self):
        # return reverse('control:experts', kwargs={'obj_id': self.id})


class About(Base):
    title = models.CharField(max_length=200, blank=True, default='', verbose_name=_(u'Title About'))
    text = models.CharField(max_length=1000, blank=True, default='', verbose_name=_(u'Bottom text'))

    @classmethod
    def get_or_create(cls, **kwargs):
        try:
            obj = cls.objects.get(**kwargs)
        except About.DoesNotExist:
            obj = cls.objects.create(**kwargs)
        return obj

    def export_control(self):
        data = {}

        data.update({
            'id': self.id,
            'title': self.title,
            'text': self.text,
        })

        return data

    def export_front(self):
        data = {}

        data.update({
            'id': self.id,
            'title': self.title,
            'text': self.text,
        })

        return data


class Page(Base):
    pass


class Post(Base):
    title = models.CharField(max_length=100, verbose_name=u'Заголовок поста')
