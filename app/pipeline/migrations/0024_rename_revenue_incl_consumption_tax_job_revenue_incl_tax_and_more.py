# Generated by Django 4.2.1 on 2023-08-16 03:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline', '0023_job_consumption_tax_amt_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='job',
            old_name='revenue_incl_consumption_tax',
            new_name='revenue_incl_tax',
        ),
        migrations.AlterField(
            model_name='job',
            name='consumption_tax_amt',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='month',
            field=models.CharField(default=8, max_length=2),
        ),
    ]
