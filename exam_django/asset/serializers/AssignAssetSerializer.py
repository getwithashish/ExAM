
# from rest_framework import serializers

# class AssignAssetSerializer(serializers.Serializer):
#     employee= serializers.CharField()
#     asset_category = serializers.CharField()
#     asset_uuid = serializers.CharField()


# serializers.py
from rest_framework import serializers
from asset.models import Asset, AssetType

class AssignAssestSerializer(serializers.ModelSerializer):
    asset_type_id = serializers.PrimaryKeyRelatedField(queryset=AssetType.objects.all(), write_only=True)  # PrimaryKeyRelatedField for selecting asset type

    class Meta:
        model = Asset
        fields = ['id', 'custodian', 'asset_type_id']  # Include 'asset_type_id' in the serializer output

    def validate_asset_type_id(self, value):
        try:
            asset_type = AssetType.objects.get(pk=value.pk)
        except AssetType.DoesNotExist:
            raise serializers.ValidationError("Asset type does not exist.")
        
        # Add any additional validation logic here if needed
        return value

    def update(self, instance, validated_data):
        instance.custodian_id = validated_data.get('custodian_id', instance.custodian_id)
        instance.asset_type_id = validated_data.get('asset_type_id', instance.asset_type_id)
        instance.save()
        return instance
