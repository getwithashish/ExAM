from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from asset.serializers import AssetTypeSerializer
from asset.service.asset_type_crud_service.asset_type_service import AssetTypeService, AssetTypeValidationService
from response import APIResponse
from messages import (
    INVALID_ASSET_TYPE,
    VALID_ASSET_TYPE
)


class AssetTypeView(ListCreateAPIView):
    serializer_class = AssetTypeSerializer

    def get_permissions(self):
        if self.request.method == "GET" or self.request.method == "POST":
            return [IsAuthenticated()]
        return super().get_permissions()

    def post(self, request, format=None):
        data = request.data
        is_valid = AssetTypeValidationService.is_valid_asset_type_data(data)
        if is_valid:
            asset_type, message, http_status = AssetTypeService.create_asset_type(data)
            return APIResponse(
                data=asset_type,
                message=message,
                status=http_status)
            
        return APIResponse(
            data=data,
            message=INVALID_ASSET_TYPE,
            status=status.HTTP_404_NOT_FOUND)

    def get(self, request, format=None):
        asset_types, message, http_status = AssetTypeService.retrieve_asset_types(request)
        return APIResponse(data=asset_types, message=message, status=http_status)