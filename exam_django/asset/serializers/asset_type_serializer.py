from rest_framework import serializers
from asset.models import AssetType


class AssetTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for the AssetType model.
    
    The serializer includes all fields from the AssetType model.
    """
    class Meta:
        model = AssetType
        fields = "__all__"
