# Generated by Django 4.1.7 on 2024-01-09 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager', '0004_remove_dates_of_rooms_room1_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='prices',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rooms', models.JSONField(default='{}')),
            ],
        ),
    ]
