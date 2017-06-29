# -*- coding: utf-8 -*-

from django.views.generic import TemplateView
import data

from front.models import About, Card

# Базовая вьюха, от которой наследуются остальные
class BaseView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)
        # Тут можно определить контекст, характерный для всех страниц сайта (например, разделы меню и т.п.)
        return context


class IndexView(BaseView):
    template_name = 'front/pages/Index/Index.jinja'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context.update(data.index)

        context.update({
            'data': data.index,
            'cards': Card.export_front_all()
        })

        return context


class AboutView(BaseView):
    template_name = 'front/pages/About/About.jinja'

    def get_context_data(self, **kwargs):
        context = super(AboutView, self).get_context_data(**kwargs)

        context.update({
            'about': About.get_or_create().export_front()
        })

        return context
