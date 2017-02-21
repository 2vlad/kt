# -*- coding: utf-8 -*-

import sys
import traceback
from django.template import loader, Context
from django.http import HttpResponseServerError
from django.views.generic import TemplateView


def demo_500(request):
    try:
        raise Exception('Demo 500')
    except:
        return custom_500(request)


def custom_500(request):
    t = loader.get_template('500.html', using='django')

    try:
        print sys.exc_info()
    except:
        pass

    type, value, tb = sys.exc_info()

    tbf = traceback.format_exception(type, value, tb)
    tbfs = '\n'.join(tbf)

    return HttpResponseServerError(t.render(Context({
        'exception_value': value,
        'value': type,
        'traceback': tbfs})))


class Custom404View(TemplateView):
    template_name = 'front/pages/NotFound/NotFound.jinja'

    def get(self, request, *args, **kwargs):
        response = super(Custom404View, self).get(request, *args, **kwargs)
        response.reason_phrase = 'NOT FOUND'
        response.status_code = 404
        return response
