# -*- coding: utf-8 -*-
import json
from abc import ABCMeta, abstractproperty

from django.contrib.auth.decorators import user_passes_test
from django.core.serializers.json import DjangoJSONEncoder
from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.generic import View

from openrussia.models import Node
from openrussia.utils import has_edit_access


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
        return self.save(request)

    def put(self, request, obj_id):
        return self.save(request)

    def patch(self, request, obj_id):
        return self.save(request)

    def delete(self, request, obj_id):
        try:
            obj = self.model.objects.get(id=int(obj_id))
            if isinstance(obj, Node):
                pass
            obj.delete()
            return HttpResponse(json.dumps({}), content_type='application/json')
        except self.model.DoesNotExist:
            raise Http404

    def save(self, request):
        data = json.loads(request.body.decode("utf-8"))
        if isinstance(data, list):
            objs = self.model.import_all(data)
            return HttpResponse(
                json.dumps([getattr(obj, self.export_func)() for obj in objs if obj], cls=DjangoJSONEncoder),
                content_type="application/json")
        else:
            obj = self.model.import_item(data)
            return HttpResponse(json.dumps(getattr(obj, self.export_func)(), cls=DjangoJSONEncoder),
                                content_type="application/json")


class EditAccessMixin(object):
    def dispatch(self, *args, **kwargs):
        if args[0].method == 'GET' or args[0].method == 'HEAD':
            return self.get(*args, **kwargs)
        else:
            return super(EditAccessMixin, self).dispatch(*args, **kwargs)

    @method_decorator(user_passes_test(has_edit_access))
    def post(self, *args, **kwargs):
        return super(EditAccessMixin, self).post(*args, **kwargs)

    @method_decorator(user_passes_test(has_edit_access))
    def put(self, *args, **kwargs):
        return super(EditAccessMixin, self).put(*args, **kwargs)

    @method_decorator(user_passes_test(has_edit_access))
    def patch(self, *args, **kwargs):
        return super(EditAccessMixin, self).patch(*args, **kwargs)

    @method_decorator(user_passes_test(has_edit_access))
    def delete(self, *args, **kwargs):
        return super(EditAccessMixin, self).delete(*args, **kwargs)


class UserAjaxView(BaseAjaxView):
    __metaclass__ = ABCMeta

    def save(self, request):
        data = json.loads(request.body.decode("utf-8"))
        if isinstance(data, list):
            objs = self.model.import_all(data, user=request.user)
            return HttpResponse(
                json.dumps([getattr(obj, self.export_func)() for obj in objs if obj], cls=DjangoJSONEncoder),
                content_type="application/json")
        else:
            obj = self.model.import_item(data, user=request.user)
            return HttpResponse(json.dumps(getattr(obj, self.export_func)(), cls=DjangoJSONEncoder),
                                content_type="application/json")
