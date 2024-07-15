# Generated by Django 5.0.2 on 2024-07-15 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("asset", "0008_alter_asset_os"),
    ]

    operations = [
        migrations.AlterField(
            model_name="asset",
            name="status",
            field=models.CharField(
                choices=[
                    ("STOCK", "STOCK"),
                    ("USE", "USE"),
                    ("DAMAGED", "DAMAGED"),
                    ("REPAIR", "REPAIR"),
                    ("OUTDATED", "OUTDATED"),
                    ("SCRAP", "SCRAP"),
                ],
                default="STOCK",
                max_length=50,
            ),
        ),
    ]
