# -*- coding: utf-8 -*-

"""
Django settings for starter project.

Generated by 'django-admin startproject' using Django 1.8.17.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if os.path.isfile(os.path.join(BASE_DIR, 'config.json')):
    with open(os.path.join(BASE_DIR, 'config.json')) as f:
        config = json.loads(f.read())
else:
    with open(os.path.join(BASE_DIR, 'config.test.json')) as f:
        config = json.loads(f.read())


def get_config(setting, config=config):
    """Get the secret variable or return explicit exception."""
    try:
        return config[setting]
    except KeyError:
        print "Set the {0} config parameter in config.json".format(setting)
        return ''


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'pa3t^sfb=19zkn4%4lazrv3seclo%3=u7w(69k%s*=29+!3$-='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'front',
    'tools.files',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # Раскомментировать если необходимо подключить отдельно мобильную версию сайта
    # 'tools.various.middleware.MobileDetectionMiddleware',
)

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [os.path.join(os.path.abspath(BASE_DIR), 'templates'),
                 os.path.join(os.path.abspath(BASE_DIR), 'assets', 'app'),
                 os.path.join(os.path.abspath(BASE_DIR), 'assets', 'custom_libs'),
                 os.path.join(os.path.abspath(BASE_DIR), 'static')],
        'APP_DIRS': True,
        'OPTIONS': {
            'trim_blocks': True,
            'lstrip_blocks': True,
            'environment': 'config.jinja.environment',
            'extensions': ['jinja2.ext.do', 'jinja2.ext.loopcontrols', 'jinja2.ext.i18n', 'jinja2.ext.with_',],
        },
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': get_config('DB_NAME'),
        'USER': get_config('DB_USER'),
        'PASSWORD': get_config('DB_PASSWORD'),
        'HOST': get_config('DB_HOST'),
        'PORT': get_config('DB_PORT'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


class Lang:
    En = 'en'


LANGUAGES = (
    (Lang.En, 'English'),
)

LANGUAGES_TUPLE = (Lang.En, )

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

FRONT_STATS = None
CONTROL_STATS = None

try:
    with open(os.path.join(BASE_DIR, 'webpack.front.stats.json')) as front_stats:
        FRONT_STATS = json.load(front_stats)
except IOError:
    print 'No webpack.front.stats.json file'

try:
    with open(os.path.join(BASE_DIR, 'webpack.control.stats.json')) as control_stats:
        CONTROL_STATS = json.load(control_stats)
except IOError:
    print 'No webpack.control.stats.json file'

# Information to link builded static files with Django.
# For Django to know by what name to reference
WEBPACK_BUNDLES = {
    'front': FRONT_STATS,
    'control': CONTROL_STATS,
}
