from asset.models import Asset
from rest_framework import serializers


class SearchAssetnamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"