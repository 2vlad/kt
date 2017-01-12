# -*- coding: utf-8 -*-

import urllib2

from bs4 import BeautifulSoup, Tag, NavigableString, Comment

from tools.remote_typograf.RemoteTypograf import RemoteTypograf


def find(f, seq):
    """Return first item in sequence where f(item) == True."""
    for item in seq:
        if f(item):
            return item


# Количество символов Unicode на которые разбивать строки для Типографа
CHUNK_SIZE = 15000


def typografy_by_chunks(text):
    soup = BeautifulSoup(text, "html.parser")
    root_elements = soup.contents

    chunks = []
    chunk = ''

    for element in root_elements:
        if isinstance(element, Tag):
            tag_contents = unicode(element)
            if (len(chunk) + len(tag_contents)) <= CHUNK_SIZE:
                chunk += tag_contents
            else:
                chunks.append(chunk)
                chunk = tag_contents
        elif isinstance(element, Comment):
            tag_contents = Comment.PREFIX + unicode(element) + Comment.SUFFIX
            if (len(chunk) + len(tag_contents)) <= CHUNK_SIZE:
                chunk += tag_contents
            else:
                chunks.append(chunk)
                chunk = tag_contents
        elif isinstance(element, NavigableString):
            chunk += unicode(element)
        else:
            pass
    chunks.append(chunk)

    # parts = int(math.ceil(len(text) / float(CHUNK_SIZE)))
    # chunks = [text[p * CHUNK_SIZE:p * CHUNK_SIZE + CHUNK_SIZE] for p in xrange(parts)]

    rt = RemoteTypograf()
    rt.p(0)
    rt.br(0)

    results = u''
    for chunk in chunks:
        chunk = chunk.replace(u'\xa0', u' ')
        chunk = chunk.replace(u'\x03', u'')
        chunk = chunk.replace(u'&#151;', u'&mdash;')
        result = rt.processText(chunk.encode('utf-8')).decode('utf-8')
        if result == u'Error: unknown action or encoding':
            raise Exception
        if 'Server Error' in result:
            raise Exception
        results += result

    return results


def fix_markup(text):
    return text.replace(u'&#132;', u'&bdquo;') \
        .replace(u'&#8222;', u'&bdquo;') \
        .replace(u'&#147;', u'&ldquo;') \
        .replace(u'&#8220;', u'&ldquo;') \
        .replace(u'&#151;', u'&mdash;') \
        .replace(u'&#150;', u'&ndash;') \
        .replace(u'&#145;', u'&lsquo;') \
        .replace(u'&#146;', u'&rsquo;')


def typography(text):
    try:
        typographied_text = typografy_by_chunks(text)
    except Exception as e:
        typographied_text = text

    return fix_markup(typographied_text)


def decode(data):
    return unicode(urllib2.unquote(data.encode('utf-8')).decode('utf-8'))
