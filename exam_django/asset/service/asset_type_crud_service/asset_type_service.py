from typing import Any, Tuple, Dict
from rest_framework import status
from rest_framework.request import Request

from asset.models import AssetType
from asset.serializers import AssetTypeSerializer
from messages import (
    ASSET_TYPE_RETRIEVE_FAILURE,
    ASSET_TYPE_RETRIEVE_SUCCESS,
    INVALID_ASSET_TYPE,
    VALID_ASSET_TYPE,
)


class AssetTypeService:
    """
    Service class for operations related to asset type
    """

    @staticmethod
    def create_asset_type(data) -> Tuple[Dict[str, Any], str, int]:
        """
        Create a new asset type.

        Args:
            data: asset type data.

        Returns:
            Tuple[Dict[str, Any], str, int]: The serialized asset type data, message, and the HTTP status code.
        """

        serializer = AssetTypeSerializer(data=data)
        message_success: str = VALID_ASSET_TYPE
        message_failure: str = INVALID_ASSET_TYPE

        if serializer.is_valid():
            asset_type = serializer.save()
            serialized_asset_type = AssetTypeSerializer(asset_type).data
            
            return serialized_asset_type, message_success, status.HTTP_201_CREATED

        return serializer.errors, message_failure, status.HTTP_404_NOT_FOUND

    @staticmethod
    def retrieve_asset_types(request: Request) -> Tuple[Dict[str, Any], str, int]:
        """
        Retrieve a list of asset types, optionally filtering by a search query.

        Args:
            request (Request): The HTTP request containing parameters.

        Returns:
            Tuple[Dict[str, Any], str, int]: The serialized list of asset types, message, and the HTTP status code.
        """

        try:
            queryset = AssetType.objects.all()
            message_success: str = ASSET_TYPE_RETRIEVE_SUCCESS
            message_failure: str = ASSET_TYPE_RETRIEVE_FAILURE

            search_query = request.GET.get("query", None)

            if search_query:
                queryset = queryset.filter(asset_type_name__istartswith=search_query)

            serializer = AssetTypeSerializer(queryset, many=True)
            return serializer.data, message_success, status.HTTP_200_OK

        except Exception as e:
            return str(e), message_failure, status.HTTP_404_NOT_FOUND
