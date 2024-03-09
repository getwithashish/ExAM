from asset.models import Asset
from rest_framework import serializers

class AssignAssetSerializer(serializers.ModelSerializer):
      class Meta:
        model = Asset
        fields = "__all__"
        read_only_fields = (
            "asset_category",
            "product_name",
            "date_of_purchase",
            "request_type",
            "asset_type",
            "business_unit",
        )