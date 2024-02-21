


# serializers.py
from rest_framework import serializers
from asset.models import Asset, Employee

class AssignAssetSerializer(serializers.Serializer):
    asset_uuid = serializers.UUIDField()
    employee_name = serializers.CharField()