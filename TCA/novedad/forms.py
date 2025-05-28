from django import forms
from django.contrib.admin import widgets
import django.forms.widgets 
import datetime
from .models import Novedades, Evento, Autoridad
year = (datetime.date.today()).strftime("%Y")
YEARS = []
for i in range(10):
    f = int(year) - i
    YEARS.append(str(f))

class FechaForm(forms.Form):    
    fechaDescarga = forms.DateField( widget=forms.SelectDateWidget(years=YEARS), initial=datetime.date.today)

    # def __init__(self, *args, **kwargs):
    #     super(FechaForm, self).__init__(*args, **kwargs)

class NovedadForm(forms.ModelForm):
    oficina = forms.ChoiceField(
        choices=Novedades._meta.get_field('oficina').choices,
        widget=forms.Select(),
        label='Oficina',
    )
    evento = forms.ModelChoiceField(
        queryset= Evento.objects.all(),
        required=True,          # obligatorio
        empty_label=None,
        widget=forms.Select(),
        label="Evento"
    )
    lugar = forms.CharField(
        label="LUGAR DEL EVENTO O INCIDENTE:",
        max_length=50,
        widget=forms.Textarea(attrs={
            'cols': 15,
            'rows': 2,
            'placeholder': 'Maximo 50 caracteres'
        })
    )
    descripcion = forms.CharField(
        label="DESCRIPCION",
        max_length=300,
        widget=forms.Textarea(attrs={
            'cols': 30,
            'rows': 10,
            'placeholder': 'Maximo 300 caracteres'
        })
    )

    nacionalidades = forms.CharField(
        label="Nacionalidades Involucradas",
        max_length=300,
        required=False,
        widget=forms.Textarea(attrs={
            'cols': 30,
            'rows': 10,
        })
    )

    titulo = forms.CharField(
        label="Titulo de la Nota",
        max_length=50,
        widget=forms.Textarea(attrs={
            'cols': 15,
            'rows': 2,
            'placeholder': 'Maximo 50 caracteres'
        })
    )
    
    class Meta:
        model = Novedades
        fields = ['oficina', 'titulo', 'evento',  'lugar', 'descripcion', 'no_migrantes', 'nacionalidades', 'autoridades', 'archivoN']
        labels = {
            'no_migrantes': 'No de Migrantes Involucrados',
            'archivoN': 'Agrega evidencias',
        }
        widgets = {
            'autoridades': forms.CheckboxSelectMultiple(),
        }