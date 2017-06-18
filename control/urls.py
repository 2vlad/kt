from django.conf.urls import url

from . import views

from control.api import AboutAjaxView, CardAjaxView, SourceAjaxView

urlpatterns = [url(r'^$', views.CardListView.as_view(), name='cards'),

               url(r'^about/$', views.AboutView.as_view(), name='about'),

               url(r'^cards/(?P<obj_id>\d+)/$', views.CardView.as_view(), name='card'),

               url(r'^cards/new/$', views.CardView.as_view(), name='card-new'),

               # url(r'^posts/new/$', views.PostView.as_view(), name='post-new'),
               # url(r'^posts/(?P<obj_id>\d+)/$', views.PostView.as_view(), name='post-new'),
               ]

# API
urlpatterns += [url(r'^api/about/$', AboutAjaxView.as_view()),
                url(r'^api/about/(?P<obj_id>\w+)$', AboutAjaxView.as_view()),

                url(r'^api/card/$', CardAjaxView.as_view()),
                url(r'^api/card/(?P<obj_id>\w+)$', CardAjaxView.as_view()),

                url(r'^api/cards/$', CardAjaxView.as_view()),
                url(r'^api/cards/(?P<obj_id>\w+)$', CardAjaxView.as_view()),

                url(r'^api/source/$', SourceAjaxView.as_view()),
                url(r'^api/source/(?P<obj_id>\w+)$', SourceAjaxView.as_view()),

                url(r'^api/sources/$', SourceAjaxView.as_view()),
                url(r'^api/sources/(?P<obj_id>\w+)$', SourceAjaxView.as_view()),
                ]
