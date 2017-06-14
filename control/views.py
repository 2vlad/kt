# -*- coding: utf-8 -*-
from django.http import Http404
from django.views.generic import TemplateView

from front.models import About, Field


# Базовая вьюха, от которой наследуются остальные
class BaseView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)
        # Тут можно определить контекст, характерный для всех страниц сайта (например, разделы меню и т.п.)
        return context


class AboutView(BaseView):
    template_name = 'control/pages/AboutPage/AboutPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(AboutView, self).get_context_data(**kwargs)

        context.update({
            'about': About.get_or_create().export_control()
        })

        return context


class FieldListView(BaseView):
    template_name = 'control/pages/FieldListPage/FieldListPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(FieldListView, self).get_context_data(**kwargs)
        obj_id = kwargs.get('obj_id')

        if obj_id:
            try:
                obj = Field.objects.get(id=obj_id).export_control()
            except Field.DoesNotExist:
                raise Http404
        else:
            obj = None

        context.update({
            'field': obj,
            'fieldList': Field.get_or_create().export_control_all()
        })

        return context
