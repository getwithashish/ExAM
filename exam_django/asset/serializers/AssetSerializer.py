# exam_django/asset/serializers/AssetSerializer
from rest_framework import serializers
from asset.models import Asset
from asset.serializers.AssetTypeSerializer import AssetTypeSerializer
from asset.serializers.EmployeeSerializer import EmployeeSerializer
from asset.serializers.BusinessUnitSerializer import BusinessUnitSerializer
from asset.serializers.LocationSerializer import LocationSerializer
from asset.serializers.UserSerializer import UserSerializer


class AssetReadSerializer(serializers.ModelSerializer):

    asset_type = AssetTypeSerializer()
    custodian = EmployeeSerializer()
    location = LocationSerializer()
    invoice_location = LocationSerializer()
    business_unit = BusinessUnitSerializer()
    conceder = UserSerializer()

    class Meta:
        model = Asset
        fields = "__all__"


class AssetWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Asset
        fields = "__all__"
