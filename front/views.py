import sys
import traceback

from django.shortcuts import redirect
from django.template import loader, Context
from django.core.urlresolvers import reverse
from django.http import HttpResponseServerError
from django.template.response import TemplateResponse


def index_view(request):
    return TemplateResponse(request, 'front/assets/app/pages/Index/Index.jinja', {})


# def custom_500(request):
#     t = loader.get_template('500.html', using='django')
#
#     print sys.exc_info()
#     type, value, tb = sys.exc_info()
#
#     tbf = traceback.format_exception(type, value, tb)
#     tbfs = ''
#     for tbfi in tbf:
#         tbfs += '\n' + tbfi
#
#     return HttpResponseServerError(t.render(Context({
#         'exception_value': value,
#         'value': type,
#         'tb': tbfs})))
#
#
# def custom_404(request):
#     return redirect(reverse('starter:index'))
