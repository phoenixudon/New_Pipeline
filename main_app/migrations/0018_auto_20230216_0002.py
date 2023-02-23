# Generated by Django 3.2.15 on 2023-02-16 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0017_alter_job_job_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='name_japanese',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='client',
            name='proper_name_japanese',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='client',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='proper_name',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
