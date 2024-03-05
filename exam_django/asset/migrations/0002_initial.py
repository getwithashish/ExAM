# Generated by Django 5.0.2 on 2024-03-05 13:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('asset', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='conceder',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_conceder', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='asset',
            name='requester',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_requester', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assetlog',
            name='asset_uuid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.asset'),
        ),
        migrations.AddField(
            model_name='asset',
            name='asset_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.assettype'),
        ),
        migrations.AddField(
            model_name='asset',
            name='business_unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='asset.businessunit'),
        ),
        migrations.AddField(
            model_name='asset',
            name='custodian',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_custodian', to='asset.employee'),
        ),
        migrations.AddField(
            model_name='asset',
            name='invoice_location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_invoice_location', to='asset.location'),
        ),
        migrations.AddField(
            model_name='asset',
            name='location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_location', to='asset.location'),
        ),
        migrations.AddField(
            model_name='asset',
            name='memory',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='asset.memory'),
        ),
    ]
