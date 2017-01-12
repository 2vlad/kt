# -*- coding: utf-8 -*-

import sys
import traceback

from django.http import HttpResponseNotFound
from django.shortcuts import render
from django.template import loader, Context
from django.http import HttpResponseServerError
from django.template.response import TemplateResponse


def index_view(request):
    return TemplateResponse(request, 'front/pages/Index/Index.jinja', {})


def custom_500(request):
    t = loader.get_template('500.html', using='django')

    print sys.exc_info()
    type, value, tb = sys.exc_info()

    tbf = traceback.format_exception(type, value, tb)
    tbfs = ''
    for tbfi in tbf:
        tbfs += '\n' + tbfi

    return HttpResponseServerError(t.render(Context({
        'exception_value': value,
        'value': type,
        'tb': tbfs})))


def custom_404(request):
    return HttpResponseNotFound(render(request, 'front/pages/NotFound/NotFound.jinja',
                                       {'userData': {'authenticated': request.user.is_authenticated(),
                                                     'id': request.user.id,
                                                     'isActive': request.user.is_active,}}))
