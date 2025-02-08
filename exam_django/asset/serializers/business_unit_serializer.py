from rest_framework import serializers
from asset.models import BusinessUnit


class BusinessUnitSerializer(serializers.ModelSerializer):
    """
    Serializer for the asset business Unit
    """
    class Meta:
        model = BusinessUnit
        fields = "__all__"
