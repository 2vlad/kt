# -*- coding: utf-8 -*-
import json
from abc import ABCMeta, abstractproperty

from django.core.serializers.json import DjangoJSONEncoder
from django.http import Http404
from django.http import HttpResponse
from django.views.generic import View


class BaseAjaxView(View):
    """
    Абстрактный класс ajax вьюхи с готовыми методами POST, PUT, DELETE
    """
    __metaclass__ = ABCMeta

    export_func = 'export_control'

    @abstractproperty
    def model(self):
        pass

    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))

        return self.save(data)

    def put(self, request, obj_id):
        data = json.loads(request.body.decode("utf-8"))

        return self.save(data)

    def patch(self, request, obj_id):
        data = json.loads(request.body.decode("utf-8"))

        return self.save(data)

    def delete(self, request, obj_id):
        try:
            obj = self.model.objects.get(id=int(obj_id))
            obj.delete()

            return HttpResponse(json.dumps({}), content_type='application/json')
        except self.model.DoesNotExist:
            raise Http404

    def save(self, data):
        if isinstance(data, list):
            objs = self.model.import_all(data)

            return HttpResponse(
                json.dumps([getattr(obj, self.export_func)() for obj in objs if obj], cls=DjangoJSONEncoder),
                content_type="application/json")
        else:
            obj = self.model.import_item(data)

            return HttpResponse(json.dumps(getattr(obj, self.export_func)(), cls=DjangoJSONEncoder),
                                content_type="application/json")

