# Generated by Django 4.1.7 on 2024-01-09 15:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0005_prices'),
    ]

    operations = [
        migrations.RenameField(
            model_name='prices',
            old_name='rooms',
            new_name='prices',
        ),
    ]