# Generated by Django 5.0.2 on 2024-02-22 12:22

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AssetType',
            fields=[
                ('asset_type_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('asset_type_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='BusinessUnit',
            fields=[
                ('business_unit_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('business_unit_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('employee_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('employee_name', models.CharField(max_length=255)),
                ('employee_department', models.CharField(max_length=255)),
                ('employee_designation', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('location_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('location_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Memory',
            fields=[
                ('memory_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('memory_space', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('asset_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('asset_id', models.CharField(max_length=255, null=True)),
                ('version', models.IntegerField(default=0)),
                ('asset_category', models.CharField(choices=[('HARDWARE', 'HARDWARE'), ('SOFTWARE', 'SOFTWARE')], max_length=50)),
                ('product_name', models.CharField(max_length=255)),
                ('model_number', models.CharField(default=None, max_length=255, null=True)),
                ('serial_number', models.IntegerField(default=None, null=True)),
                ('owner', models.CharField(choices=[('EXPERION', 'EXPERION')], max_length=50)),
                ('date_of_purchase', models.DateField()),
                ('status', models.CharField(choices=[('IN USE', 'IN USE'), ('IN STORE', 'IN STORE'), ('IN REPAIR', 'IN REPAIR'), ('EXPIRED', 'EXPIRED'), ('DISPOSED', 'DISPOSED')], default='IN STORE', max_length=50)),
                ('warranty_period', models.IntegerField()),
                ('os', models.CharField(blank=True, choices=[('WINDOWS', 'WINDOWS'), ('LINUX', 'LINUX'), ('MAC', 'MAC')], max_length=50, null=True)),
                ('os_version', models.CharField(max_length=50)),
                ('mobile_os', models.CharField(blank=True, max_length=100, null=True)),
                ('processor', models.CharField(blank=True, max_length=100, null=True)),
                ('memory', models.CharField(blank=True, max_length=50, null=True)),
                ('storage', models.CharField(blank=True, max_length=50, null=True)),
                ('configuration', models.TextField()),
                ('accessories', models.CharField(blank=True, max_length=50, null=True)),
                ('notes', models.CharField(max_length=255)),
                ('approval_status', models.CharField(choices=[('PENDING', 'PENDING'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED'), ('CANCELLED', 'CANCELLED')], default='PENDING', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('asset_type', models.ForeignKey(default='employee', on_delete=django.db.models.deletion.CASCADE, to='asset.assettype')),
                ('business_unit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.businessunit')),
                ('custodian', models.ForeignKey(default='employee', on_delete=django.db.models.deletion.CASCADE, related_name='assets_custodian', to='asset.employee')),
                ('invoice_location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assets_invoice_location', to='asset.location')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assets_location', to='asset.location')),
                ('conceder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.user')),
            ],
        ),
    ]
