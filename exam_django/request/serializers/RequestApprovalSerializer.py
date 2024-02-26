import uuid
from rest_framework import serializers
from request.models import Request
from asset.models import Asset


class RequestApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

    # def update(self, instance, validated_data):
    #     instance.request_status = "Pending","Rejected"
    #     instance.save()
    #     return instance


