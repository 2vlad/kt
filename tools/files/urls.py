from django.conf.urls import url

from . import views

urlpatterns = [url(r'^upload_temp_file/$', views.upload_temp_file, name='control-temp-file-upload'),
               url(r'^upload_temp_file/(\w+)/$', views.upload_temp_file, name='control-temp-file-upload-p'),
               url(r'^upload_temp_files/$', views.upload_temp_files, name='control-temp-file-uploads'),
               url(r'^upload_temp_files/(\w+)/$', views.upload_temp_files, name='control-temp-file-uploads-p'),

               url(r'^detect_color_type/$', views.detect_color_type, name='control-temp-file-detect-color-type'), ]
