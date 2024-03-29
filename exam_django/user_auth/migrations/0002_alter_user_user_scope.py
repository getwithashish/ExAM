# Generated by Django 5.0.2 on 2024-03-09 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("user_auth", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="user_scope",
            field=models.CharField(
                choices=[
                    ("MANAGER", "MANAGER"),
                    ("LEAD", "LEAD"),
                    ("SYSTEM_ADMIN", "SYSTEM_ADMIN"),
                ],
                max_length=20,
            ),
        ),
    ]
