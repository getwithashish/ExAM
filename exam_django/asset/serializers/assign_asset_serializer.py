from rest_framework import serializers
from asset.models import Asset


class AssignAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = (
            "asset_id",
            "model_number",
            "serial_number",
            "warranty_period",
            "os",
            "os_version",
            "mobile_os",
            "processor",
            "processor_gen",
            "storage",
            "configuration",
            "accessories",
            "notes",
            "approval_status_message",
            "custodian",
            "location",
            "invoice_location",
            "memory",
            "approved_by",
            "requester",
        )
