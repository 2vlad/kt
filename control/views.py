# -*- coding: utf-8 -*-
from django.http import Http404
from django.views.generic import TemplateView

from front.models import Post


# Базовая вьюха, от которой наследуются остальные
class BaseView(TemplateView):
    def get_context_data(self, **kwargs):
        context = super(BaseView, self).get_context_data(**kwargs)
        # Тут можно определить контекст, характерный для всех страниц сайта (например, разделы меню и т.п.)
        return context


class IndexView(BaseView):
    template_name = 'control/pages/Index/Index.jinja'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        return context


class PostListView(BaseView):
    template_name = 'control/pages/PostList/PostList.jinja'

    def get_context_data(self, **kwargs):
        context = super(PostListView, self).get_context_data(**kwargs)

        context['post_list'] = Post.export_control_all()

        return context


class PostView(BaseView):
    template_name = 'control/pages/Post/Post.jinja'

    def get_context_data(self, **kwargs):
        context = super(PostView, self).get_context_data(**kwargs)

        obj_id = kwargs.get('obj_id')
        if obj_id:
            try:
                obj = Post.objects.get(id=obj_id).export_control()
            except Post.DoesNotExist:
                raise Http404
        else:
            obj = None

        context['post'] = obj

        return context
