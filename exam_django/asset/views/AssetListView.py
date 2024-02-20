from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import AssetListSerializer
from asset.models import Asset
from rest_framework.pagination import LimitOffsetPagination

class AssetListView(ListAPIView):
    serializer_class = AssetListSerializer
    queryset = Asset.objects.all()
    pagination_class = LimitOffsetPagination

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())  # Apply filtering
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

