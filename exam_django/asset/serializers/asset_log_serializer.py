from rest_framework import serializers
from asset.models.asset_log import AssetLog


class AssetLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetLog
        fields = "__all__"
        read_only_fields = ("timestamp",)
