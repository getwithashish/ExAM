# exam_django/asset/serializers/AssetSerializer
from rest_framework import serializers
from asset.models import Asset, AssetType


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
            return None
        except Exception:
            return None
    
    
