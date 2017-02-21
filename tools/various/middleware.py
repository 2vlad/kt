from django.contrib.sessions.middleware import SessionMiddleware
from django.core.urlresolvers import reverse, resolve
from django.shortcuts import redirect

from tools.vendor.mobileesp import mdetect


class MobileDetectionMiddleware(object):
    """
    Useful middleware to detect if the user is
    on a mobile device.
    """

    def process_request(self, request):
        is_mobile = False
        is_tablet = False
        is_phone = False

        user_agent = request.META.get("HTTP_USER_AGENT")
        http_accept = request.META.get("HTTP_ACCEPT")
        if user_agent and http_accept:
            agent = mdetect.UAgentInfo(userAgent=user_agent, httpAccept=http_accept)
            is_tablet = agent.detectTierTablet()
            is_phone = agent.detectTierIphone()
            is_mobile = is_tablet or is_phone or agent.detectMobileQuick()

        request.is_mobile = is_mobile
        request.is_tablet = is_tablet
        request.is_phone = is_phone

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path.startswith('/api/') \
                or request.path.startswith('/control/') \
                or request.path.startswith('/media/'):
            return

        if '/mobile' not in request.path and request.is_phone:
            return redirect('/mobile' + request.path)


class ContextMiddleware(object):
    def process_template_response(self, request, response):
        app = request.resolver_match.app_name
        # if app == 'uk' or app == 'mobile':
        #     response.context_data['contacts'] = Contacts.get_or_create().export_front()

        return response


class ViewNameMiddleware(object):
    def process_view(self, request, view_func, view_args, view_kwargs):
        url_name = resolve(request.path).url_name
        request.url_name = url_name


class CustomSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
        if not request.session.exists(request.session.session_key):
            request.session.create()
