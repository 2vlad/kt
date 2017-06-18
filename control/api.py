# -*- coding: utf-8 -*-

import json
from abc import ABCMeta, abstractproperty

import requests
from django.http import HttpResponse, Http404
from django.views.generic import View
from front.models import About, Card, Source
from tools.various.db import date_handler


# from tools.various.api import EditAccessMixin


class BaseAjaxView(View):
    # """
    # Абстрактный класс ajax вьюхи с готовыми методами POST, PUT, DELETE
    # """
    __metaclass__ = ABCMeta

    @abstractproperty
    def model(self):
        pass

    def post(self, request):
        return self.save(request)

    def put(self, request, obj_id):
        return self.save(request)

    def delete(self, request, obj_id):
        try:
            obj = self.model.objects.get(id=int(obj_id))
            obj.delete()
            return HttpResponse(status=200)
        except self.model.DoesNotExist:
            raise Http404

    def save(self, request):
        data = json.loads(request.body.decode("utf-8"))
        if isinstance(data, list):
            objs = self.model.import_all(data)
            return HttpResponse(json.dumps([obj.export_control() for obj in objs if obj], default=date_handler),
                                content_type="application/json")
        else:
            obj = self.model.import_item(data)
            return HttpResponse(json.dumps(obj.export_control(), default=date_handler), content_type="application/json")


class AboutAjaxView(BaseAjaxView):
    model = About


class CardAjaxView(BaseAjaxView):
    model = Card


class SourceAjaxView(BaseAjaxView):
    model = Source

