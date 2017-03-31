from settings import *  # noqa

DEBUG = False

TEMPLATE_DEBUG = DEBUG

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'), ) # noqa

STATIC_ROOT = None
