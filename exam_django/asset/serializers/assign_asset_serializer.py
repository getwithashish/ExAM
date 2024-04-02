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


# from asset.models import Asset
# from rest_framework import serializers

# class AssignAssetSerializer(serializers.ModelSerializer):
#       class Meta:
#         model = Asset
#         fields = "__all__"
#         read_only_fields = (
#             "asset_category",
#             "product_name",
#             "date_of_purchase",
#             "request_type",
#             "asset_type",
#             "business_unit",
#         )
