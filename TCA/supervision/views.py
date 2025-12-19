from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.conf import settings

from django.views.generic import FormView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

from .mixins import AccessKeyRequiredMixin
from panel.forms import AccessKeyForm

from .models import (
    Formulario,
    Seccion,
    SubSeccion,
    Pregunta,
    RespuestaFormulario,
)
from .serializers import (
    FormularioSerializer,
    SeccionSerializer,
    SubseccionSerializer,
    PreguntaSerializer,
    RespuestaFormularioSerializer,
)

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class AccessKeyView(FormView):
    template_name = 'panel/access_key.html'
    form_class = AccessKeyForm
    success_url = reverse_lazy('superv_urls:index')

    def form_valid(self, form):
        llave = form.cleaned_data['key']
        if llave == settings.SUPERVISION_KEY:
            # self.request.session['has_access'] = True
            self.request.session['access_keyS'] = llave
            return super().form_valid(form)
        form.add_error('key', 'Clave incorrecta')
        return self.form_invalid(form)

class InicioView(LoginRequiredMixin, AccessKeyRequiredMixin, TemplateView):
    template_name = "supervision/index_s.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        req = super().get_context_data(request=self.request.get_host())
        context["debug"] = settings.DEBUG
        context["url_i"] = req['request']
        # print(context["url_i"])
        return context
    
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class FormularioViewSet(viewsets.ModelViewSet):
    queryset = Formulario.objects.all()
    serializer_class = FormularioSerializer
    
    @action(detail=False, methods=["get"])
    def ultimo(self, request):
        ultimo = self.get_queryset().order_by("-id").first()
        if not ultimo:
            return Response({}, status=200)
        serializer = self.get_serializer(ultimo)
        return Response(serializer.data)


class SeccionViewSet(viewsets.ModelViewSet):
    queryset = Seccion.objects.all()
    serializer_class = SeccionSerializer


class SubSeccionViewSet(viewsets.ModelViewSet):
    queryset = SubSeccion.objects.all()
    serializer_class = SubseccionSerializer


class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer


class RespuestaFormularioViewSet(viewsets.ModelViewSet):
    queryset = RespuestaFormulario.objects.all()
    serializer_class = RespuestaFormularioSerializer
