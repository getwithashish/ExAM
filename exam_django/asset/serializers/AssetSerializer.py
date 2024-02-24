# exam_django/asset/serializers/AssetSerializer
from rest_framework import serializers
from asset.models import Asset, AssetType, Employee, Location
from rest_framework.response import Response
from rest_framework import status


class AssetSerializer(serializers.ModelSerializer):

    asset_type = serializers.SerializerMethodField()
    custodian = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = "__all__"

    def get_asset_type(self, obj):
        try:
            if obj.asset_type:
                serializer = AssetType.objects.get(
                    asset_type_uuid=obj.asset_type.asset_type_uuid
                )
                return serializer.asset_type_name
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(
                "Asset Type not found", status=status.HTTP_404_NOT_FOUND)

    def get_custodian(self, obj):
        try:
            if obj.custodian:
                serializer = Employee.objects.get(
                    employee_uuid=obj.custodian.employee_uuid
                )
                return serializer.employee_name
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(
                "Custodian not found", status=status.HTTP_404_NOT_FOUND)
    
    def get_location(self, obj):
        try:
            if obj.location:
                serializer = Location.objects.get(
                    location_uuid=obj.location.location_uuid
                )
                return serializer.location_name
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(
                "Location not found", status=status.HTTP_404_NOT_FOUND)
