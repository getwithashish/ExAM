from django.db.models import Q
from asset.models import Asset
from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from response import APIResponse
from rest_framework.permissions import IsAuthenticated


class QueryBuilderView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AssetWriteSerializer
        else:
            return AssetReadSerializer

    def get(self, request):
        asset_category = request.GET.get("asset_category")
        asset_status = request.GET.get("status")
        owner = request.GET.get("owner")

        query = Q()

        if asset_category:
            query &= Q(asset_category=asset_category)
        if status:
            query &= Q(status=asset_status)
        if owner:
            query &= Q(owner=owner)

        assets = Asset.objects.filter(query)
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(assets, many=True)
        return APIResponse(data=serializer.data, message="success", status=status.HTTP_200_OK)
