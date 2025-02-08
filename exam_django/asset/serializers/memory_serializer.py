from rest_framework import serializers
from asset.models import Memory


class MemorySerializer(serializers.ModelSerializer):
    """
    Serializer for asset memory
    """
    class Meta:
        model = Memory
        fields = "__all__"
