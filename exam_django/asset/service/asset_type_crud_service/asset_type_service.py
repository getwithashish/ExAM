from asset.models import AssetType
from asset.serializers import AssetTypeSerializer
from messages import (
    ASSET_TYPE_RETRIEVE_FAILURE,
    ASSET_TYPE_RETRIEVE_SUCCESS,
    INVALID_ASSET_TYPE,
    VALID_ASSET_TYPE,
)
from rest_framework import status


class AssetTypeService:
    @staticmethod
    def create_asset_type(data):
        serializer = AssetTypeSerializer(data=data)
        message_success = VALID_ASSET_TYPE
        message_failure = INVALID_ASSET_TYPE
        if serializer.is_valid():
            asset_type = serializer.save()
            serialized_asset_type = AssetTypeSerializer(
                asset_type
            ).data  # Serialize the object
            return serialized_asset_type, message_success, status.HTTP_201_CREATED
        return serializer.errors, message_failure, status.HTTP_404_NOT_FOUND

    @staticmethod
    def retrieve_asset_types(request):
        try:
            queryset = AssetType.objects.all()
            message_success = ASSET_TYPE_RETRIEVE_SUCCESS
            message_failure = ASSET_TYPE_RETRIEVE_FAILURE

            search_query = request.GET.get("query", None)

            if search_query:
                queryset = queryset.filter(asset_type_name__istartswith=search_query)

            serializer = AssetTypeSerializer(queryset, many=True)
            return serializer.data, message_success, status.HTTP_200_OK

        except Exception as e:
            return str(e), message_failure, status.HTTP_404_NOT_FOUND
