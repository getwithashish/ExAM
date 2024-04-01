from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.service.asset_lifecycle_crud_service.asset_lifecycle_service import AssetLifeCycleService



class AssetLifeCycleView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, asset_uuid):
        return AssetLifeCycleService.get_asset_logs(asset_uuid)