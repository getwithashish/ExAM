from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetSerializer
from asset.models import Asset
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter


class AssetView(ListCreateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [SearchFilter]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())

            # Applying custom limit and offset if provided in query parameters
            limit = request.query_params.get("limit")
            offset = request.query_params.get("offset")

            if limit:
                self.pagination_class.default_limit = limit

            if offset:
                self.pagination_class.default_offset = offset

            # Applying pagination
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
