# Generated by Django 4.2.6 on 2024-09-19 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0034_registro_fecha_creacion_registro_porcentaje_avance_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificacion',
            name='registro_id',
            field=models.IntegerField(default=1),
        ),
    ]
