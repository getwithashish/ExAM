from rest_framework.generics import ListAPIView
from asset.models import Asset
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from rest_framework import status

from messages import (
    ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
    
)


class AssetCountView(ListAPIView):
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        hardware_counts = (
            Asset.objects.filter(asset_category="HARDWARE", approval_status="APPROVED")
            .values("status")
            .annotate(count=Count("status"))
        )

        software_counts = (
            Asset.objects.filter(asset_category="SOFTWARE", approval_status="APPROVED")
            .values("status")
            .annotate(count=Count("status"))
        )

        response_data = {
            "hardware": [
                {"status": item["status"], "count": item["count"]}
                for item in hardware_counts
            ],
            "software": [
                {"status": item["status"], "count": item["count"]}
                for item in software_counts
            ],
        }

        return APIResponse(
            data=response_data,
            message=ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
            status=status.HTTP_200_OK,
        )
