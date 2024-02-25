import uuid
from rest_framework import serializers
from request.models import Request
from asset.models import Asset


class RequestApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

    def update(self, instance, validated_data):
        instance.request_status = "Pending"
        instance.save()
        return instance

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     data["message"] = "Request has been rejected."
    #     return data
