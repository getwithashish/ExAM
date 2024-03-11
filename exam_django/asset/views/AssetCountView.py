from rest_framework.generics import ListAPIView
from asset.models import Asset
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from rest_framework import status

from messages import ASSET_COUNT_SUCCESSFULLY_RETRIEVED


class AssetCountView(ListAPIView):
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        asset_type = self.request.query_params.get("asset_type")

        queryset = Asset.objects.all()
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)

        asset_counts = queryset.values("status").annotate(count=Count("status"))
        total_assets = queryset.count()

        response_data = {
            "total_assets": total_assets,
            "asset_status": {item["status"]: item["count"] for item in asset_counts},
        }

        return APIResponse(
            data=response_data,
            message=ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
            status=status.HTTP_200_OK,
        )
