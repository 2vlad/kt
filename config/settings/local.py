# -*- coding: utf-8 -*-

import os
from base import *  # noqa

DEBUG = True

TEMPLATE_DEBUG = DEBUG

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'), ) # noqa

STATIC_ROOT = None
