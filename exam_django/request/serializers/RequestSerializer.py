from rest_framework import serializers
from asset.models import Request
from asset.models import Asset


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

    def validate_asset_id(self, value):
        try:
            Asset.objects.get(pk=value)
        except Asset.DoesNotExist:
            raise serializers.ValidationError(
                "Asset with this ID does not exists.")
        return value
