# -*- coding: utf-8 -*-

from django.conf.urls import url
from django.conf import settings
from . import views
from . import views_utils

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
]

if settings.DEBUG:
    urlpatterns += [
        url(r'^404/$', views_utils.Custom404View.as_view()),
        url(r'^500/$', views_utils.demo_500),
    ]
