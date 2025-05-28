from django.contrib import admin
from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('inicio/', views.inicio, name='novedades'),
    path('reporte/', views.reporteNovedad, name='reporteN'),
    path('informes/<int:year>/<int:month>/<int:day>/', views.fechasNovedad, name='novedades_por_fecha'),
    path('eliminarN/<int:idMensaje>/', views.eliminarN, name='eliminar_novedad'),
    path('editarN/<int:idMensaje>/', views.editarN, name='editar_novedad'),
]