from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import FechaForm, NovedadForm
from .models import Novedades
from usuarios.models import UsuarioP
from datetime import date, datetime, time, timedelta
from django.utils import timezone
from django.http import JsonResponse, HttpResponse

from django.template.loader import get_template
from weasyprint import HTML
from datetime import *
import os

# Create your views here.

types_ORS = [
        ("1", "AGUASCALIENTES"),
        ("2", "BAJA CALIFORNIA"),
        ("3", "BAJA CALIFORNIA SUR"),
        ("4", "CAMPECHE"),
        ("5", "COAHUILA"),
        ("6", "COLIMA"),
        ("7", "CHIAPAS"),
        ("8", "CHIHUAHUA"),
        ("9", "CDMX"),
        ("10", "DURANGO"),
        ("11", "GUANAJUATO"),
        ("12", "GUERRERO"),
        ("13", "HIDALGO"),
        ("14", "JALISCO"),
        ("15", "EDOMEX"),
        ("16", "MICHOACÁN"),
        ("17", "MORELOS"),
        ("18", "NAYARIT"),
        ("19", "NUEVO LEÓN"),
        ("20", "OAXACA"),
        ("21", "PUEBLA"),
        ("22", "QUERÉTARO"),
        ("23", "QUINTANA ROO"),
        ("24", "SAN LUIS POTOSÍ"),
        ("25", "SINALOA"),
        ("26", "SONORA"),
        ("27", "TABASCO"),
        ("28", "TAMAULIPAS"),
        ("29", "TLAXCALA"),
        ("30", "VERACRUZ"),
        ("31", "YUCATÁN"),
        ("32", "ZACATECAS"),
    ]

@login_required
def inicio(request):
    if request.method == 'POST':
        form = FechaForm(request.POST)
        if form.is_valid():
            fechaS = form.cleaned_data['fechaDescarga']
            return redirect('novedades_por_fecha',year=fechaS.year, month= fechaS.month, day=fechaS.day)
    else:
        form = FechaForm()
        context = {
                # 'usuario' : userDataI,
                'form': FechaForm(),
            }
        return render(request, "novedad/indexN.html", context)

@login_required
def fechasNovedad(request,year=None, month=None, day=None):
    userDataI = UsuarioP.objects.filter(user__username=request.user).first()
    tipoUser = userDataI.tipo
    info_dia = date(year, month, day)
    

    if request.method == 'POST':
        form = NovedadForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('novedades_por_fecha',year=year, month= month, day=day)
    
    else:
        formNov = NovedadForm()
        oficinaB = 8
        oficinasL = []
        if int(userDataI.OR) < 33:
            oficinaB = int(userDataI.OR)
        
        inicio_naive = datetime.combine(info_dia - timedelta(days=1), time(18, 1))
        fin_naive = datetime.combine(info_dia, time(18, 0))

        # Si tu proyecto usa USE_TZ = True, convierte a aware
        tz = timezone.get_current_timezone()
        inicio = timezone.make_aware(inicio_naive, tz)
        fin    = timezone.make_aware(fin_naive,    tz)
        
        if tipoUser == "1":
            mensajes = Novedades.objects.filter(fecha__range=(inicio, fin)).order_by('fecha')
        else:
            # oficina_user = types_ORS[f'{userDataI.OR}'] 
            mensajes = Novedades.objects.filter(fecha__range=(inicio, fin), oficina=userDataI.OR).order_by('fecha')
            oficinasL.append(types_ORS[oficinaB])
            formNov.fields['oficina'].choices = oficinasL

        context = {
                'dataU': userDataI,
                'form': FechaForm(),
                'mensajes': mensajes,
                'formNov': formNov,
                'fecha': info_dia,
                'fecha_ref': date.today(),
            }
        
        return render(request, "novedad/mensajes.html", context)
    
@login_required
def eliminarN(request, idMensaje):
    mensajeI = get_object_or_404(Novedades, idNovedad=idMensaje)
    userDataI = UsuarioP.objects.filter(user__username=request.user).first()

    info_dia = date(mensajeI.fecha.year, mensajeI.fecha.month, mensajeI.fecha.day)

    if userDataI.tipo == "1" and request.method == 'POST':
        mensajeI.delete()
        return redirect('novedades_por_fecha',year=info_dia.year, month= info_dia.month, day=info_dia.day)
    else:
        return redirect('novedades_por_fecha',year=info_dia.year, month= info_dia.month, day=info_dia.day)
    

@login_required
def editarN(request, idMensaje):
    mensajeI = get_object_or_404(Novedades, idNovedad=idMensaje)
    userDataI = UsuarioP.objects.filter(user__username=request.user).first()

    info_dia = date(mensajeI.fecha.year, mensajeI.fecha.month, mensajeI.fecha.day)
    if userDataI.tipo == "1" and request.method == 'POST':
        form = NovedadForm(request.POST, instance=mensajeI)
        if form.is_valid():
            form.save()
            return redirect('novedades_por_fecha',year=info_dia.year, month= info_dia.month, day=info_dia.day)
    else:
        form = NovedadForm(instance=mensajeI)
        context = {
                'dataU': userDataI,
                'form': form,
                'mensajeI': mensajeI,
                'info_dia': info_dia
            }
        return render(request, 'novedad/editarN.html', context)
    
@login_required
def reporteNovedad(request):
    fecha = request.GET.get('fecha')
    tipo = request.GET.get('tipo')

    if fecha != None and tipo != None:
        fecha_date = datetime.strptime(fecha, "%Y/%m/%d")

        inicio_naive = datetime.combine(fecha_date - timedelta(days=1), time(18, 1))
        fin_naive = datetime.combine(fecha_date, time(6, 0))

        if(tipo=="V"):
            inicio_naive = datetime.combine(fecha_date, time(6, 0))
            fin_naive = datetime.combine(fecha_date, time(18, 0))

        tz = timezone.get_current_timezone()
        inicio = timezone.make_aware(inicio_naive, tz)
        fin    = timezone.make_aware(fin_naive,    tz)

        mensajes = Novedades.objects.filter(fecha__range=(inicio, fin)).order_by('fecha')

        context = {
            "fecha_actual": fecha,
        }

        # Renderizar el template HTML con los datos
        template = get_template("estadistica/reporteN.html")
        html_string = template.render(context)

        # Crear el PDF con WeasyPrint
        pdf_file = HTML(string=html_string).write_pdf()

        # Devolver el PDF como respuesta HTTP
        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="reporte_Diario{tipo}.pdf"'

        return response

    else:
        print(fecha, tipo)

        form = FechaForm()
        context = {
                # 'usuario' : userDataI,
                'form': FechaForm(),
            }
        return render(request, "novedad/indexN.html", context)