from django.conf.urls import url

from . import views

from control.api import AboutAjaxView, FieldListAjaxView

urlpatterns = [url(r'^$', views.FieldListView.as_view(), name='control-main'),
               # url(r'^fields/(?P<obj_id>\d+)/$', views.FieldView.as_view(), name='post-new'),
               url(r'^about/$', views.AboutView.as_view(), name='about'),
               # url(r'^posts/new/$', views.PostView.as_view(), name='post-new'),
               # url(r'^posts/(?P<obj_id>\d+)/$', views.PostView.as_view(), name='post-new'),
               ]

# API
urlpatterns += [url(r'^api/about/$', AboutAjaxView.as_view()),
                url(r'^api/about/(?P<obj_id>\w+)$', AboutAjaxView.as_view()),
                url(r'^api/fields/$', FieldListAjaxView.as_view()),
                url(r'^api/fields/(?P<obj_id>\w+)$', FieldListAjaxView.as_view()),
                ]
