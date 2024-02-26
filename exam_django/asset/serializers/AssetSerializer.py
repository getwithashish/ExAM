# exam_django/asset/serializers/AssetSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status

from asset.models import Asset, AssetType, Employee, Location, BusinessUnit, User


class AssetSerializer(serializers.ModelSerializer):

    asset_type = serializers.SerializerMethodField()
    custodian = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    invoice_location = serializers.SerializerMethodField()
    business_unit = serializers.SerializerMethodField()
    conceder = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = "__all__"

    def get_asset_type(self, obj):
        try:
            if obj.asset_type:
                serializer = AssetType.objects.get(id=obj.asset_type.id)
                return {"id": serializer.id, "asset_type": serializer.asset_type_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response("Asset Type not found", status=status.HTTP_404_NOT_FOUND)

    def get_custodian(self, obj):
        try:
            if obj.custodian:
                serializer = Employee.objects.get(id=obj.custodian.id)
                return {"id": serializer.id, "custodian_name": serializer.employee_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response("Custodian not found", status=status.HTTP_404_NOT_FOUND)

    def get_location(self, obj):
        try:
            if obj.location:
                serializer = Location.objects.get(id=obj.location.id)
                return {"id": serializer.id, "location_name": serializer.location_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response("Location not found", status=status.HTTP_404_NOT_FOUND)

    def get_invoice_location(self, obj):
        try:
            if obj.invoice_location:
                serializer = Location.objects.get(id=obj.invoice_location.id)
                return {"id": serializer.id, "location_name": serializer.location_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response(
                "Invoice Location not found", status=status.HTTP_404_NOT_FOUND
            )

    def get_business_unit(self, obj):
        try:
            if obj.business_unit:
                serializer = BusinessUnit.objects.get(
                    id=obj.business_unit.id
                )
                return {"id": serializer.id, "business_unit_name": serializer.business_unit_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response("Business Unit not found", status=status.HTTP_404_NOT_FOUND)

    def get_conceder(self, obj):
        try:
            if obj.conceder:
                serializer = User.objects.get(id=obj.conceder.id)
                full_name = f"{serializer.first_name} {serializer.last_name}"
                return {"id": serializer.id, "conceder_name": full_name}
            return Response(status=status.HTTP_200_OK)
        except Exception:
            return Response("Conceder not found", status=status.HTTP_404_NOT_FOUND)
