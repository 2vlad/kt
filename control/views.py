# -*- coding: utf-8 -*-
from django.http import Http404
from django.views.generic import TemplateView

from front.models import About, Card, Source


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


class CardView(BaseView):
    template_name = 'control/pages/CardPage/CardPage.jinja'
        #
        # project = None
        #
        # projects = Project.export_front_all()
        # related_projects = ProjectRelationship.export_front_all()
        # related_array = []
        # list_of_ids = []
        #
        # for r in related_projects:
        #     if r['origin'] == obj_id:
        #         related_array.append(r['related'])
        #
        #
        # for p in projects:
        #     if p['id'] == obj_id:
        #         project = p
        #
        # for p in projects:
        #     list_of_ids.append(p['id'])
        #
        # if obj_id not in list_of_ids:
        #     raise Http404
        #
        # context['relatedProjects'] = related_array
        # context['project'] = project
        # context['projects'] = projects
        #
        # return context

    def get_context_data(self, **kwargs):
        context = super(CardView, self).get_context_data(**kwargs)

        obj_id = int(kwargs.get('obj_id'))

        if obj_id:
            try:
                obj = Card.objects.get(id=obj_id).export_control()
            except Card.DoesNotExist:
                raise Http404
        else:
            obj = None

        # program = []
        # program_array = Source.export_control_all()

        # for p in program_array:
        #     if p['field'] == obj['id']:
        #         program.append(p['field'])

        # print(program)

        # field = obj['field']
        # sources = [s.export_control() for s in Source.objects.filter(field_id=obj_id)]

        # print(obj)

        context.update({
            'card': obj,
            # 'lostProjects': [n.export_control() for n in Source.objects.filter(id=None).order_by('order')],
            # 'program': Source.export_control_all()
        })

        return context


class CardListView(BaseView):
    template_name = 'control/pages/CardListPage/CardListPage.jinja'

    def get_context_data(self, **kwargs):
        context = super(CardListView, self).get_context_data(**kwargs)

        context.update({
            'cardList': Card.export_control_all(),
        })

        return context

