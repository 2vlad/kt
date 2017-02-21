"""starter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls import include, url, patterns
from tools.various.decorators import login_required_flat, required
from front.views_utils import Custom404View

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('front.urls', app_name='front', namespace='front')),
]

urlpatterns += required(
    login_required_flat,
    patterns('',
             (r'^control/api/', include('tools.files.urls')),
             (r'^control/', include('tools.various.urls')), )
)

handler404 = Custom404View.get
handler500 = 'front.views_utils.custom_500'

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
                                {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}), )
