# -*- coding: utf-8 -*-

import os
import shutil
import datetime
from uuid import uuid1

from django.db.models.fields.files import FieldFile
from django.db import models
from django.db.models import signals
from django.conf import settings
from django.template import Context, Template
from django.utils.deconstruct import deconstructible

from utils import resize_bulk, remove_all_pictures, get_out_file, get_image_dimension


# Resolution arguments:
# 'w','h',
# 'crop'        : 'center'/None,
# 'corners'     : 0..max(w/2,h/2),
# 'qual'        : 1..100,
# 'out_format'  : 'png' and others
# 'add_param'   : convert additional parameters

# try:
#     from south.modelsinspector import add_introspection_rules
#
#     add_introspection_rules([], ["^.*\.CustomFileField"])
#     add_introspection_rules([], ["^.*\.CustomImgField"])
# except:
#     pass

IMAGES_DIRECTORY_ORIGINAL = 'original'


def get_path(path, instance):
    try:
        # TODO: обдумать, протестить адаптивные урлы
        path.index('{{')
        t = Template(path)
        new_path = t.render(Context({"instance": instance}))
        return new_path
    except:
        return path


# заменил функцию обертку на решение отсюда:
# https://code.djangoproject.com/ticket/22999#no1
@deconstructible
class GenerateFilenameTo(object):
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, old_filename):
        base_name, file_ext = os.path.splitext(old_filename)
        date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S__")
        new_filename = date + str(uuid1()) + file_ext
        return os.path.join(get_path(self.path, instance), new_filename)


class CustomFieldFile(FieldFile):
    def url(self):
        return os.path.join(self.field.MEDIA_URL, self.field.my_path, self.fname).replace('\\',
                                                                                          '/') if self.fname else ''

    def __init__(self, instance, field, name):
        self.fname = os.path.basename(name) if name else None
        super(CustomFieldFile, self).__init__(instance, field, name)


class CustomFileField(models.FileField):
    my_path = ''
    attr_class = CustomFieldFile

    def __init__(self, file_path='fake', upload_to=None, MEDIA_URL=None, **kwargs):
        file_path = os.path.normpath(file_path)
        self.my_path = file_path
        if not MEDIA_URL:
            MEDIA_URL = settings.MEDIA_URL

        self.MEDIA_URL = MEDIA_URL

        if not upload_to:
            upload_to = GenerateFilenameTo(self.my_path)
        super(CustomFileField, self).__init__(upload_to=upload_to, **kwargs)

    @classmethod
    def clear_files_on_delete(cls, instance, field_instance):
        inst_file = getattr(instance, field_instance.name, None)
        if inst_file:
            if os.path.isfile(getattr(inst_file, 'path')):
                os.unlink(getattr(inst_file, 'path'))

    def contribute_to_class(self, cls, name):
        def clear_file(sender, instance, **kwargs):
            self.__class__.clear_files_on_delete(instance, self)

        super(CustomFileField, self).contribute_to_class(cls, name)
        signals.pre_delete.connect(clear_file, sender=cls, weak=False)

    @classmethod
    def save(cls, instance, field_instance):
        try:
            cl = instance.__class__
            old_inst = cl.objects.get(id=instance.id)

            n = getattr(instance, field_instance.name, None)
            o = getattr(old_inst, field_instance.name, None)
            if o and not n:
                cls.clear_files_on_delete(old_inst, field_instance)
            elif o and n:
                pn = getattr(n, 'path')
                po = getattr(o, 'path')
                if pn != po:
                    cls.clear_files_on_delete(old_inst, field_instance)
        except:
            pass

    def pre_save(self, model_instance, add):
        self.__class__.save(model_instance, self)
        return super(CustomFileField, self).pre_save(model_instance, add)


class CustomFieldImg(FieldFile):
    def __init__(self, instance, field, name):
        super(CustomFieldImg, self).__init__(instance, field, name)

        res = field.my_resolutions(instance) if hasattr(field.my_resolutions, '__call__') else field.my_resolutions

        fname = os.path.basename(name) if name else None
        for res_key, size in res.items():
            out_fname = get_out_file(fname, size)
            path = get_path(field.my_path, instance)
            setattr(self, res_key.replace('@', '') + '_url',
                    os.path.join(settings.MEDIA_URL, path, res_key, out_fname).replace('\\', '/') if out_fname else '')
            setattr(self, res_key.replace('@', '') + '_path',
                    os.path.join(settings.MEDIA_ROOT, path, res_key, out_fname) if out_fname else '')

    def take_file(self, path, original_name=False, custom_name='', save=True):
        if original_name:
            name = os.path.basename(path)
        elif custom_name:
            name = custom_name
            try:
                name.index('.')
            except ValueError:
                name += '.' + os.path.splitext(os.path.basename(path))[1]
        else:
            name = GenerateFilenameTo('')(self.instance, os.path.basename(path))
        new_my_path = get_path(self.field.my_path, self.instance)
        name = os.path.join(new_my_path, IMAGES_DIRECTORY_ORIGINAL, name)
        new_path = os.path.join(settings.MEDIA_ROOT, name)
        try:
            os.makedirs(os.path.dirname(new_path), 0775)
        except:
            pass
        shutil.copyfile(path, new_path)
        setattr(self.instance, self.field.attname, name)

        if save:
            self.instance.save()

    def tn(self, tn_name=None):
        return getattr(self, tn_name + '_url', '')

    def tn_path(self, tn_name=None):
        return getattr(self, tn_name + '_path', '')

    def ratio(self):
        res = self.image_size()
        if not res: return None
        return res[0] * 1.0 / res[1]

    def image_size(self):
        return get_image_dimension(self.path)

    def regenerate_images(self, tn_name=None):
        CustomImgField.generate_images(self.instance, self.field, tn_name)
        pass


class CustomImgField(CustomFileField):
    attr_class = CustomFieldImg
    my_resolutions = {}

    def __init__(self, file_path='fake', upload_to=None, resolutions={}, **kwargs):
        file_path = os.path.normpath(file_path)
        self.my_resolutions = resolutions
        upload_to = GenerateFilenameTo(os.path.join(file_path, IMAGES_DIRECTORY_ORIGINAL))
        super(CustomImgField, self).__init__(file_path=file_path, upload_to=upload_to, **kwargs)

    @classmethod
    def generate_images(cls, instance, field_instance, tn_name=None):
        # print 'generating images'
        base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
        inst_file = getattr(instance, field_instance.name, None)

        res = field_instance.my_resolutions(instance) if hasattr(field_instance.my_resolutions,
                                                                 '__call__') else field_instance.my_resolutions

        if inst_file:
            resize_bulk(base_dir, os.path.basename(getattr(inst_file, 'path')), res, tn_name)

    @classmethod
    def clear_files_on_delete(cls, instance, field_instance):
        base_dir = os.path.join(settings.MEDIA_ROOT, get_path(field_instance.my_path, instance))
        inst_file = getattr(instance, field_instance.name, None)

        res = field_instance.my_resolutions(instance) if hasattr(field_instance.my_resolutions,
                                                                 '__call__') else field_instance.my_resolutions

        if inst_file:
            remove_all_pictures(base_dir, os.path.basename(getattr(inst_file, 'path')), res)

    @classmethod
    def save(cls, instance, field_instance):
        def gen():
            def save_images_once(sender, instance, **kwargs):
                cls.generate_images(instance, field_instance)
                signals.post_save.disconnect(save_images_once, sender=instance.__class__, weak=False)

            signals.post_save.connect(save_images_once, sender=instance.__class__, weak=False)

        try:
            cl = instance.__class__
            old_inst = cl.objects.get(id=instance.id)

            n = getattr(instance, field_instance.name, None)
            o = getattr(old_inst, field_instance.name, None)
            if o and not n:
                cls.clear_files_on_delete(old_inst, field_instance)
            elif not o and n:
                gen()
            elif o and n:
                pn = getattr(n, 'path')
                po = getattr(o, 'path')
                if pn != po:
                    cls.clear_files_on_delete(old_inst, field_instance)
                    gen()
        except:
            gen()
