from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from asset.service.asset_count_service.asset_count_service import AssetCountService


class AssetCountView(ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        query = request.GET.get("asset_type")
        responseData, message, http_status = AssetCountService.get_asset_count(query)
        return APIResponse(data=responseData, message=message, status=http_status)
