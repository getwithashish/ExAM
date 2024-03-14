# from rest_framework.generics import ListAPIView
# from asset.models import Asset
# from django.db.models import Count
# from rest_framework.permissions import IsAuthenticated
# from response import APIResponse
# from rest_framework import status
# from rest_framework import serializers
# from messages import ASSET_COUNT_SUCCESSFULLY_RETRIEVED


# class DummySerializer(serializers.Serializer):
#     pass


# class AssetCountView(ListAPIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = DummySerializer

#     def list(self, request, *args, **kwargs):
#         asset_type = self.request.query_params.get("asset_type")

#         queryset = Asset.objects.all()
#         if asset_type:
#             queryset = queryset.filter(asset_type=asset_type)

#         asset_counts = queryset.values("status").annotate(count=Count("status"))
#         total_assets = queryset.count()

#         response_data = {
#             "total_assets": total_assets,
#             "asset_status": {item["status"]: item["count"] for item in asset_counts},
#         }

#         return APIResponse(
#             data=response_data,
#             message=ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
#             status=status.HTTP_200_OK,
#         )

from rest_framework.generics import ListAPIView
from asset.models import Asset
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from rest_framework import status
from rest_framework import serializers
from messages import ASSET_COUNT_SUCCESSFULLY_RETRIEVED


class AssetCountView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.Serializer  # Update serializer class as needed

    def list(self, request, *args, **kwargs):
        asset_type = self.request.query_params.get("asset_type")

        queryset = Asset.objects.all()
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)

        # Annotate counts for different statuses, asset_detail_status, and assign_status
        status_counts = queryset.values("status").annotate(count=Count("status"))
        detail_status_counts = queryset.values("asset_detail_status").annotate(count=Count("asset_detail_status"))
        assign_status_counts = queryset.values("assign_status").annotate(count=Count("assign_status"))

        total_assets = queryset.count()

        response_data = {
            "total_assets": total_assets,
            "status_counts": {item["status"]: item["count"] for item in status_counts},
            "asset_detail_status": {item["asset_detail_status"]: item["count"] for item in detail_status_counts},
            "assign_status": {item["assign_status"]: item["count"] for item in assign_status_counts},
        }

        return APIResponse(
            data=response_data,
            message=ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
            status=status.HTTP_200_OK,
        )
