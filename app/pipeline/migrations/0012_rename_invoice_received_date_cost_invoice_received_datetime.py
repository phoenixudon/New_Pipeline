# Generated by Django 4.2.9 on 2025-01-17 09:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline', '0011_cost_invoice_received_date_alter_cost_invoice_status_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cost',
            old_name='invoice_received_date',
            new_name='invoice_received_datetime',
        ),
    ]
