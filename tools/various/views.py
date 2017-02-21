from django.contrib.auth import logout, authenticate, login
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.context import RequestContext


def user_logout(request):
    if request.user.is_authenticated():
        logout(request)
    return HttpResponseRedirect(reverse('control:control-main'))


def user_login(request, view_func, *args, **kwargs):
    if request.user.is_authenticated():
        return view_func(request, *args, **kwargs)
    state = ""
    if request.method == 'POST':
        username = request.POST.get('login')
        password = request.POST.get('pwd')
        user = authenticate(username=username, password=password)
        if user is None or not user.is_active:
            state = "Your username and/or password were incorrect."
        else:
            login(request, user)
            request.method = 'GET'
            # return view_func(request, *args, **kwargs)
            return HttpResponseRedirect(request.get_full_path())
    return render_to_response('control/login.html', {'state': state}, context_instance=RequestContext(request))

