# -*- coding: utf-8 -*-

from django.db import models
from tools.various.db import Base


class Page(Base):
    pass


class Post(Base):
    title = models.CharField(max_length=100, verbose_name=u'Заголовок поста')
