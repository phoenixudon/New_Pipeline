# Generated by Django 3.2.15 on 2023-02-17 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0024_rename_is_deleted_job_isdeleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='allVendorInvoicesReceivd',
            field=models.BooleanField(default=False),
        ),
    ]
