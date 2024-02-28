#exam_django/asset/views/TriggerView
from django.db.models.signals import pre_save
from django.dispatch import receiver
from rest_framework.views import APIView
from asset.models import AssetLog, Asset


class TriggerView(APIView):
    @receiver(pre_save, sender=Asset)
    def log_asset_changes(sender, instance, **kwargs):
        old_instance = Asset.objects.filter(pk=instance.pk).values().first()
        if old_instance:  # Check if old_instance exists
            # Exclude fields which should not be logged
            excluded_fields = ["id", "created_at", "updated_at"]
            changes = {
                field: (old_instance[field], getattr(instance, field))
                for field in old_instance
                if old_instance[field] != getattr(instance, field)
                and field not in excluded_fields
            }
            # Create AssetLog entry if there are changes
            if changes:
                asset_log_entry = AssetLog.objects.create(
                    asset_uuid=instance,
                    asset_id=instance.asset_id,
                    asset_log_timestamp=instance.updated_at,
                    version=instance.version,
                    asset_category=instance.asset_category,
                    asset_type=instance.asset_type,
                    product_name=instance.product_name,
                    model_number=instance.model_number,
                    serial_number=instance.serial_number,
                    owner=instance.owner,
                    custodian=instance.custodian,
                    date_of_purchase=instance.date_of_purchase,
                    status=instance.status,
                    warranty_period=instance.warranty_period,
                    location=instance.location,
                    invoice_location=instance.invoice_location,
                    business_unit=instance.business_unit,
                    os=instance.os,
                    os_version=instance.os_version,
                    mobile_os=instance.mobile_os,
                    processor=instance.processor,
                    processor_gen=instance.processor_gen,
                    memory=instance.memory,
                    storage=instance.storage,
                    configuration=instance.configuration,
                    accessories=instance.accessories,
                    notes=instance.notes,
                    conceder=instance.conceder,
                    approval_status=instance.approval_status,
                    created_at=instance.created_at,
                    updated_at=instance.updated_at,
                )
                asset_log_entry.save()
