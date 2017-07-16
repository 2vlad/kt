# -*- coding: utf-8 -*-

from django.conf.urls import url
from django.conf import settings
from . import views
from . import views_utils

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^about/$', views.AboutView.as_view(), name='about'),

    url(r'^cards/(?P<obj_id>\d+)/$', views.CardView.as_view(), name='card'),
]

if settings.DEBUG:
    urlpatterns += [
        url(r'^404/$', views_utils.Custom404View.as_view()),
        url(r'^500/$', views_utils.demo_500),
    ]
