# Generated by Django 5.0.4 on 2024-04-16 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='numberOfPeople',
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]