from rest_framework import serializers
from asset.models import Asset
 
class AssetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
