# -*- coding: utf-8 -*-

from django.http import Http404
from django.views.generic import TemplateView
import data
import random

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

        cards = Card.export_front_all()
        random.shuffle(cards)

        print(cards)

        context.update({
            'data': data.index,
            'cards': cards,
            'about': About.get_or_create().export_front()
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


class CardView(BaseView):
    template_name = 'front/pages/CardPage/CardPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(CardView, self).get_context_data(**kwargs)

        obj_id = kwargs.get('obj_id')

        if obj_id:
            try:
                obj = Card.objects.get(id=obj_id).export_front()
            except Card.DoesNotExist:
                raise Http404
        else:
            obj = None

        context.update({
            'data': obj,
        })

        return context
