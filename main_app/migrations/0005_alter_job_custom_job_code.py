# Generated by Django 3.2.15 on 2023-02-05 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0004_auto_20230205_1428'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='custom_job_code',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
