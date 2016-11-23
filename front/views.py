from django.template.response import TemplateResponse


def index_view(request):
    return TemplateResponse(request, 'front/assets/app/pages/Index/Index.jinja', {})
