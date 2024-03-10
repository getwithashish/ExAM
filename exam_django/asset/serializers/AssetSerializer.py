# exam_django/asset/serializers/AssetSerializer
from rest_framework import serializers
from asset.models import Asset
from asset.serializers.AssetTypeSerializer import AssetTypeSerializer
from asset.serializers.EmployeeSerializer import EmployeeSerializer
from asset.serializers.BusinessUnitSerializer import BusinessUnitSerializer
from asset.serializers.LocationSerializer import LocationSerializer
from asset.serializers.MemorySerializer import MemorySerializer
from user_auth.serializers import UserSerializer


class AssetReadSerializer(serializers.ModelSerializer):

    asset_type = AssetTypeSerializer()
    custodian = EmployeeSerializer()
    location = LocationSerializer()
    invoice_location = LocationSerializer()
    business_unit = BusinessUnitSerializer()
    conceder = UserSerializer()
    requester = UserSerializer()
    memory = MemorySerializer()

    class Meta:
        model = Asset
        fields = "__all__"


class AssetWriteSerializer(serializers.ModelSerializer):

    class Meta:

        # TODO Only specify fields that must be accepted
        # def update(self, instance, validated_data):
        # # Exclude certain fields from being updated
        # validated_data.pop('field_to_exclude', None)
        # validated_data.pop('another_field_to_exclude', None)

        model = Asset
        fields = "__all__"
        # exclude = ["conceder", "approval_status", "created_at", "updated_at", "requester", "request_type"]
        read_only_fields = (
            "custodian",
            "conceder",
            "asset_detail_status",
            "created_at",
            "updated_at",
            "requester",
            "request_type",
        )
