from django.contrib import admin
from .models import Autoridad, Evento, Novedades

# Register your models here.
admin.site.register(Autoridad)
admin.site.register(Evento)
admin.site.register(Novedades)