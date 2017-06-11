from django.conf.urls import url

from . import views

from control.api import AboutAjaxView

urlpatterns = [url(r'^$', views.IndexView.as_view(), name='control-main'),
               url(r'^about/$', views.AboutView.as_view(), name='about'),
               # url(r'^posts/new/$', views.PostView.as_view(), name='post-new'),
               # url(r'^posts/(?P<obj_id>\d+)/$', views.PostView.as_view(), name='post-new'),
               ]

# API
urlpatterns += [url(r'^api/about/$', AboutAjaxView.as_view()),
                url(r'^api/about/(?P<obj_id>\w+)$', AboutAjaxView.as_view()),
                ]
