# -*- coding: utf-8 -*-

from django.template.response import TemplateResponse


def index_view(request):
    return TemplateResponse(request, 'control/pages/Index/Index.jinja', {})
