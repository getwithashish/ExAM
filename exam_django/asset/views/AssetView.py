from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from asset.models import Asset
from rest_framework.pagination import LimitOffsetPagination


class AssetView(ListCreateAPIView):
    queryset = Asset.objects.all()
    pagination_class = LimitOffsetPagination

    def post(self, request, *args, **kwargs):
        serializer = AssetWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = AssetReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = AssetReadSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
