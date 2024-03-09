from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetTypeSerializer
from asset.models import AssetType
from response import APIResponse
from messages import (
    INVALID_ASSET_TYPE,
    VALID_ASSET_TYPE,
    ASSET_TYPE_RETRIEVE_SUCCESS,
    ASSET_TYPE_RETRIEVE_FAILURE,
)


class AssetTypeView(ListCreateAPIView):
    def post(self, request, format=None):
        # queryset = AssetType.objects.all()
        serializer = AssetTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return APIResponse(
                data=serializer.data,
                message=VALID_ASSET_TYPE,
                status=status.HTTP_201_CREATED,
            )
        return APIResponse(
            data=serializer.errors,
            message=INVALID_ASSET_TYPE,
            status=status.HTTP_404_NOT_FOUND,
        )

    def get(self, request, format=None):
        try:
            queryset = AssetType.objects.all()

            # Retrieve query parameters
            search_query = request.GET.get("query", None)

            # Filter queryset based on search query
            if search_query:
                queryset = queryset.filter(asset_type_name__istartswith=search_query)

            serializer = AssetTypeSerializer(queryset, many=True)
            return APIResponse(
                data=serializer.data,
                message=ASSET_TYPE_RETRIEVE_SUCCESS,
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return APIResponse(
                str(e),
                message=ASSET_TYPE_RETRIEVE_FAILURE,
                status=status.HTTP_404_NOT_FOUND,
            )
