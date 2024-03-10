# Generated by Django 5.0.2 on 2024-03-09 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("asset", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="asset",
            name="approval_status",
        ),
        migrations.RemoveField(
            model_name="asset",
            name="request_type",
        ),
        migrations.AddField(
            model_name="asset",
            name="asset_detail_status",
            field=models.CharField(
                choices=[
                    ("CREATE_PENDING", "CREATE_PENDING"),
                    ("UPDATE_PENDING", "UPDATE_PENDING"),
                    ("CREATED", "CREATED"),
                    ("UPDATED", "UPDATED"),
                    ("CREATE_REJECTED", "CREATE_REJECTED"),
                    ("UPDATE_REJECTED", "UPDATE_REJECTED"),
                ],
                default="CREATE_PENDING",
                max_length=50,
            ),
        ),
        migrations.AddField(
            model_name="asset",
            name="assign_status",
            field=models.CharField(
                choices=[
                    ("UNASSIGNED", "UNASSIGNED"),
                    ("ASSIGN_PENDING", "ASSIGN_PENDING"),
                    ("ASSIGNED", "ASSIGNED"),
                    ("REJECTED", "REJECTED"),
                ],
                default="UNASSIGNED",
                max_length=50,
            ),
        ),
    ]