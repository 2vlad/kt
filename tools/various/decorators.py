# -*- coding: utf-8 -*-

from functools import wraps

from .views import user_login


def required(wrapping_functions, patterns_rslt):
    if not hasattr(wrapping_functions, '__iter__'):
        wrapping_functions = (wrapping_functions,)

    return [
        _wrap_instance__resolve(wrapping_functions, instance)
        for instance in patterns_rslt
    ]


def _wrap_instance__resolve(wrapping_functions, instance):
    if not hasattr(instance, 'resolve'): return instance
    resolve = getattr(instance, 'resolve')

    def _wrap_func_in_returned_resolver_match(*args, **kwargs):
        rslt = resolve(*args, **kwargs)

        if not hasattr(rslt, 'func'): return rslt
        f = getattr(rslt, 'func')

        for _f in reversed(wrapping_functions):
            f = _f(f)

        setattr(rslt, 'func', f)

        return rslt

    setattr(instance, 'resolve', _wrap_func_in_returned_resolver_match)

    return instance


def login_required_flat(view_func):
    @wraps(view_func)
    def _checklogin(request, *args, **kwargs):
        if request.user.is_authenticated() and request.user.is_staff:
            return view_func(request, *args, **kwargs)

        return user_login(request, view_func, *args, **kwargs)

    return _checklogin
