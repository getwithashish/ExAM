# from django.db.models.signals import pre_save
# from django.dispatch import receiver
# from rest_framework.views import APIView
# from asset.models import AssetLog, Asset
# import json


# class TriggerView(APIView):
#     @receiver(pre_save, sender=Asset)
#     def log_asset_changes(sender, instance, **kwargs):
#         old_instance = Asset.objects.filter(pk=instance.pk).values().first()
#         # Check if old_instance exists
#         if old_instance and instance.approval_status == "APPROVED":
#             changes = {
#                 field: (old_instance[field], getattr(instance, field))
#                 for field in old_instance
#                 if field != "asset_uuid"
#             }
#             # Convert changes dictionary to JSON
#             asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)

#             if changes:
#                 # Get or create AssetLog entry
#                 asset_instance = Asset.objects.get(pk=instance.pk)
#                 asset_log_entry = AssetLog.objects.create(
#                     asset_uuid=asset_instance,
#                     asset_log=asset_log_data,
#                 )
#             asset_log_entry.save()

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction

from asset.models import AssetLog, Asset
import json

# Receiver function outside the view class


@receiver(pre_save, sender=Asset)
def log_asset_changes(sender, instance, **kwargs):
    old_instance = Asset.objects.filter(pk=instance.pk).values().first()
    if old_instance and instance.approval_status == "APPROVED":
        changes = {
            field: (old_instance[field], getattr(instance, field))
            for field in old_instance
            if field != "asset_uuid"
        }
        asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)

        if changes:
            with transaction.atomic():
                asset_instance = Asset.objects.select_for_update().get(pk=instance.pk)
                asset_log_entry = AssetLog.objects.create(
                    asset_uuid=asset_instance,
                    asset_log=asset_log_data,
                )
                asset_log_entry.save()
