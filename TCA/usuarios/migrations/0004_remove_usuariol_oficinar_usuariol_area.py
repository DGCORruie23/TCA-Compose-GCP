# Generated by Django 5.0.4 on 2024-04-16 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_usuariol'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuariol',
            name='oficinaR',
        ),
        migrations.AddField(
            model_name='usuariol',
            name='area',
            field=models.ManyToManyField(related_name='usuarioA', to='usuarios.area'),
        ),
    ]