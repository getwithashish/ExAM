from rest_framework import serializers
from asset.models.asset_log import AssetLog


class AssetLogSerializer(serializers.ModelSerializer):
    """
    Serializer for the AssetLog model.

    Validates and deserializes data related to AssetLog instances.
    """
    
    class Meta:
        model = AssetLog
        fields = "__all__"
        read_only_fields = ("timestamp",)
