from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from tools.files import models
import json
import utils

__author__ = 'Andrey Mirzoyan'


@csrf_exempt
def upload_temp_file(request, param=""):
    fFile = request.FILES[request.FILES.keys()[0]]
    tf = models.TempFile.create_from_form_file(request, fFile, param)
    return HttpResponse(json.dumps(tf.description()))


@csrf_exempt
def upload_temp_files(request, param=""):
    res = []
    fileName = request.FILES.keys()[0]
    for file in request.FILES.getlist(fileName):
        tf = models.TempFile.create_from_form_file(request, file, param)
        res.append(tf.description())
    return HttpResponse(json.dumps(res))


@csrf_exempt
def detect_color_type(request):
    tf = models.TempFile.get_tp_from_url(request.GET['url'])
    return HttpResponse(utils.get_color_type(tf.file.path))
