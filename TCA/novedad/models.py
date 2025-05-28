from django.db import models
from usuarios.models import User
from django.utils import timezone

# Create your models here.
class Autoridad(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

class Evento(models.Model):
    tipo_evento = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.tipo_evento

class Novedades(models.Model):
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

    idNovedad = models.AutoField(primary_key=True)
    oficina = models.CharField(max_length=2, choices=types_ORS, default="9")
    fecha = models.DateTimeField(default=timezone.now)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=50, default="")
    lugar = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=300)
    no_migrantes = models.IntegerField(default=0)
    nacionalidades = models.CharField(max_length=300)
    autoridades = models.ManyToManyField( Autoridad, blank=True)
    archivoN = models.FileField(upload_to='novedad/', blank=True, null=True)

    def __str__(self):
        return "{id}.-OR {oficina}: {titulo}".format(
            id=self.idNovedad,
            oficina=self.oficina,
            titulo=self.titulo,
        )



