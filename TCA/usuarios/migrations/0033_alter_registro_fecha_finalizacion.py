# Generated by Django 4.2.6 on 2024-07-16 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0032_alter_usuariop_or'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registro',
            name='fecha_finalizacion',
            field=models.DateField(default='1970-01-01'),
        ),
    ]