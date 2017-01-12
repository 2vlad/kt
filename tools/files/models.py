import json
import os
import re
from shutil import copyfile
from django.db import models
from django.contrib.sessions.models import Session
import fields
from django.conf import settings

TEMP_FILE_DIRECTORY = 'temp_files'


class TempFile(models.Model):
    originalName = models.CharField(max_length=200, blank=True, null=True, default="")
    file = fields.CustomFileField(file_path=TEMP_FILE_DIRECTORY, blank=True, null=True, default='')
    session = models.ForeignKey(Session)

    def url(self):
        return self.file.url()

    @staticmethod
    def create_from_form_file(request, FILE, param=""):
        fName = FILE.name
        path = fields.GenerateFilenameTo(TEMP_FILE_DIRECTORY)(None, fName)
        addr = os.path.join(settings.MEDIA_ROOT, path)

        try:
            os.makedirs(os.path.dirname(addr), 0775)
        except os.error:
            pass

        f = open(addr, 'wb')
        for chunk in FILE.chunks():
            f.write(chunk)
        f.close()

        tp = TempFile.objects.create(file=path, session=Session.objects.get(session_key=request.session.session_key),
                                     originalName=fName)
        return tp

    @classmethod
    def is_temp_url(cls, url):
        if not url: return False
        tempFilesRE = re.compile('.*/uploads/' + TEMP_FILE_DIRECTORY + '/[-_\\.\da-fA-F]+\.[^"\']*')
        return tempFilesRE.match(url)

    @classmethod
    def get_tp_from_url(cls, url):
        if cls.is_temp_url(url):
            fileNameRE = re.compile('' + TEMP_FILE_DIRECTORY + '/([-_\\.\da-fA-F]+\.[^"\'#]*)')
            fname = fileNameRE.search(url).groups()[0]
            tp = cls.objects.get(file__contains=fname)
            return tp
        else:
            return None

    @classmethod
    def deploy_cls(cls, url, new_path, origName=False):
        if cls.is_temp_url(url):
            tp = cls.get_tp_from_url(url)
            if origName:
                fname = tp.originalName
            else:
                fname = os.path.basename(url)
            newPath = os.path.join(new_path, fname)
            if os.path.isfile(newPath):
                n, e = os.path.splitext(fname)
                x = 1
                while os.path.isfile(os.path.join(new_path, n + '_' + str(x) + e)):
                    x += 1
                fname = n + '_' + str(x) + e
                newPath = os.path.join(new_path, fname)
            copyfile(tp.file.path, newPath)
            return fname
        return None

    def description(self):
        self.save()
        return {'id': self.id, 'url': self.file.url() if self.file else '', 'originalName': self.originalName,
                'size': self.file.size if self.file else 0}

    def json_description(self):
        return json.dumps(self.description())

    def deploy(self, new_path, **kwargs):
        if self.file:
            return TempFile.deploy_cls(self.file.url(), new_path, **kwargs)
        return None

    @classmethod
    def get_data_from_url(cls, url):
        tp = cls.get_tp_from_url(url)
        return open(tp.file.path, 'rb') if tp else None
