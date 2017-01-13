# -*- coding: utf-8 -*-
import json
import os
import re

from django.contrib.staticfiles.storage import staticfiles_storage
from django.utils.translation import ugettext
from django.core.urlresolvers import reverse
from django.template.loader import engines
from django.conf import settings

from jinja2 import Environment

from config.settings import BASE_DIR


def includeraw(template):
    env = engines['jinja2'].env
    source, fn, _ = env.loader.get_source(env, template)

    return source


def active(request, pattern):
    """
    Template tag to highlight selected page in the menu
    """
    if re.search(pattern, request.path):
        return 'isActive'
    return ''


def jsonify(value):
    return json.dumps(value)


def require(template):
    return includeraw(template)


def bundle(name, file):
    if settings.DEBUG:
        with open(os.path.join(settings.BASE_DIR, 'webpack.{}.stats.json'.format(name))) as stats:
            bundle_data = json.load(stats)
    else:
        bundle_data = settings.WEBPACK_BUNDLES.get(name, None)

    file_data = file.split('.')
    file_name = file_data[0]
    file_ext = file_data[1]

    chunk = bundle_data['chunks'].get(file_name, [])

    try:
        bundle_file_name = [str(f['name']) for f in chunk if str(f['name']).startswith(file_name) and str(f['name']).endswith(file_ext)][0]
    except IndexError:
        bundle_file_name = ''

    return 'app/{}/{}'.format(name, bundle_file_name)


def environment(**options):
    env = Environment(**options)

    if os.path.isfile(os.path.join(BASE_DIR, 'config.json')):
        with open(os.path.join(BASE_DIR, 'config.json')) as f:
            config = json.loads(f.read())
    else:
        with open(os.path.join(BASE_DIR, 'config.test.json')) as f:
            config = json.loads(f.read())

    env.filters['jsonify'] = jsonify
    env.filters['require'] = require

    env.globals.update({
        'bundle': bundle,
        'static': staticfiles_storage.url,
        'active': active,
        'url': reverse,
        '_': ugettext,
        'config': config,
        'settings': settings,
        'DEBUG': settings.DEBUG,
        'STATIC_URL': settings.STATIC_URL,
        'MEDIA_URL': settings.MEDIA_URL,
        'includeraw': includeraw
    })
    return env
