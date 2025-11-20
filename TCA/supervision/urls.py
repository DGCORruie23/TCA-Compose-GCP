from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AccessKeyView,
    InicioView,

    FormularioViewSet,
    SeccionViewSet,
    SubSeccionViewSet,
    PreguntaViewSet,
    RespuestaFormularioViewSet,
)

app_name = 'superv_urls'

router = DefaultRouter()
router.register(r'formularios', FormularioViewSet, basename='formularios')
router.register(r'secciones', SeccionViewSet, basename='secciones')
router.register(r'subsecciones', SubSeccionViewSet, basename='subsecciones')
router.register(r'preguntas', PreguntaViewSet, basename='preguntas')
router.register(r'respuestas', RespuestaFormularioViewSet, basename='respuestas')

urlpatterns = [
    path('clave/', AccessKeyView.as_view(), name='access_key'),
    path('', InicioView.as_view(), name='index'),
    path('registro/', InicioView.as_view(), name='registro'),
    path('instrucciones/', InicioView.as_view(), name='instrucciones'),
    path('reportes/', InicioView.as_view(), name='reportes'),
    path('api/', include(router.urls)),
]
