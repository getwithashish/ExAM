from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from asset.models import Asset
from rest_framework.pagination import LimitOffsetPagination


class AssetView(ListCreateAPIView):

    pagination_class = LimitOffsetPagination

    def post(self, request, format=None):
       
        serializer = AssetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            queryset = Asset.objects.all()

            limit = request.query_params.get("limit")
            offset = request.query_params.get("offset")

            if limit:
                self.pagination_class.default_limit = limit
            if offset:
                self.pagination_class.default_offset = offset

            # Applying pagination
            page = self.paginate_queryset(queryset)

            # TODO Wrap in custom response format
            if page is not None:
                serializer = AssetReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = AssetReadSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
