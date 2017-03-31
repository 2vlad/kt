from django.conf.urls import url

from . import views

urlpatterns = [url(r'^$', views.IndexView.as_view(), name='control-main'),
               url(r'^posts/$', views.PostListView.as_view(), name='post-list'),
               url(r'^posts/new/$', views.PostView.as_view(), name='post-new'),
               url(r'^posts/(?P<obj_id>\d+)/$', views.PostView.as_view(), name='post-new'),
               ]
