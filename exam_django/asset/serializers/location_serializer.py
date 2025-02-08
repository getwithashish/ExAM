# exam_django/asset/serializers/LocationSerializer

from rest_framework import serializers
from asset.models import Location


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for asset location
    """
    class Meta:
        model = Location
        fields = "__all__"
