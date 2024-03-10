# Generated by Django 5.0.2 on 2024-03-09 12:43

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="AssetType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("asset_type_name", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="BusinessUnit",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("business_unit_name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Employee",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("employee_name", models.CharField(max_length=100)),
                ("employee_department", models.CharField(max_length=100)),
                ("employee_designation", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Location",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location_name", models.CharField(max_length=50)),
            ],
            options={
                "ordering": ["id"],
            },
        ),
        migrations.CreateModel(
            name="Memory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("memory_space", models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(max_length=50)),
                ("last_name", models.CharField(max_length=50)),
                ("email", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Asset",
            fields=[
                (
                    "asset_uuid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("asset_id", models.CharField(max_length=255, null=True)),
                ("version", models.IntegerField(default=0)),
                (
                    "asset_category",
                    models.CharField(
                        choices=[("HARDWARE", "HARDWARE"), ("SOFTWARE", "SOFTWARE")],
                        max_length=50,
                    ),
                ),
                ("product_name", models.CharField(max_length=255)),
                (
                    "model_number",
                    models.CharField(default=None, max_length=255, null=True),
                ),
                (
                    "serial_number",
                    models.CharField(default=None, max_length=255, null=True),
                ),
                (
                    "owner",
                    models.CharField(
                        choices=[("EXPERION", "EXPERION")],
                        default="EXPERION",
                        max_length=50,
                    ),
                ),
                ("date_of_purchase", models.DateField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("IN USE", "IN USE"),
                            ("IN STORE", "IN STORE"),
                            ("IN REPAIR", "IN REPAIR"),
                            ("EXPIRED", "EXPIRED"),
                            ("DISPOSED", "DISPOSED"),
                        ],
                        default="IN STORE",
                        max_length=50,
                    ),
                ),
                ("warranty_period", models.IntegerField(null=True)),
                (
                    "os",
                    models.CharField(
                        choices=[
                            ("WINDOWS", "WINDOWS"),
                            ("LINUX", "LINUX"),
                            ("MAC", "MAC"),
                        ],
                        max_length=50,
                        null=True,
                    ),
                ),
                ("os_version", models.CharField(max_length=50, null=True)),
                ("mobile_os", models.CharField(max_length=50, null=True)),
                ("processor", models.CharField(max_length=50, null=True)),
                ("processor_gen", models.CharField(max_length=50, null=True)),
                ("storage", models.CharField(max_length=50, null=True)),
                ("configuration", models.CharField(max_length=255, null=True)),
                ("accessories", models.CharField(max_length=50, null=True)),
                ("notes", models.TextField(null=True)),
                (
                    "approval_status",
                    models.CharField(
                        choices=[
                            ("PENDING", "PENDING"),
                            ("APPROVED", "APPROVED"),
                            ("REJECTED", "REJECTED"),
                            ("CANCELLED", "CANCELLED"),
                        ],
                        default="PENDING",
                        max_length=50,
                    ),
                ),
                ("approval_status_message", models.TextField(null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "request_type",
                    models.CharField(
                        choices=[
                            ("CREATE", "CREATE"),
                            ("ASSIGN", "ASSIGN"),
                            ("UPDATE", "UPDATE"),
                        ],
                        max_length=50,
                    ),
                ),
                ("is_deleted", models.BooleanField(default=False)),
                (
                    "conceder",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="%(app_label)s_%(class)s_conceder",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "requester",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="%(app_label)s_%(class)s_requester",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "asset_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="asset.assettype",
                    ),
                ),
                (
                    "business_unit",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="asset.businessunit",
                    ),
                ),
                (
                    "custodian",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="%(app_label)s_%(class)s_custodian",
                        to="asset.employee",
                    ),
                ),
                (
                    "invoice_location",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="%(app_label)s_%(class)s_invoice_location",
                        to="asset.location",
                    ),
                ),
                (
                    "location",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="%(app_label)s_%(class)s_location",
                        to="asset.location",
                    ),
                ),
                (
                    "memory",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="asset.memory",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AssetLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("asset_log", models.JSONField()),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "asset_uuid",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="asset.asset"
                    ),
                ),
            ],
        ),
    ]
