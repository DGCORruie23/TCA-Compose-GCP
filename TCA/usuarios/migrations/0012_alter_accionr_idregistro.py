# Generated by Django 5.0.4 on 2024-04-17 00:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0011_alter_accionp_idaccion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accionr',
            name='idRegistro',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.registroa'),
        ),
    ]