from django.http import JsonResponse
from django.views import View
from asset.models import Asset
from asset.serializers import AssetSerializer
from rest_framework.generics import ListAPIView
from rest_framework import generics
from django.db.models import Q
from django.shortcuts import get_object_or_404


# Search assets by name
class AssetSearchByNameView(View):
    def get(self, request):
        query_param = request.GET.get("q")
        if query_param:
            assets = Asset.objects.filter(product_name__icontains=query_param)
        else:
            assets = Asset.objects.all()

        data = list(assets.values())
        return JsonResponse(data, safe=False)


# Search assets by serial number
class AssetSearchBySerialNumberAPIView(ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        serial_number = self.request.query_params.get("serial_number", None)
        if serial_number:
            queryset = Asset.objects.filter(
                serial_number__startswith=serial_number)
            return queryset
        else:
            return (
                Asset.objects.none()
            )

# Search based on model number
class AssetSearchByModelNumberView(generics.ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        model_number = self.request.query_params.get("model_number", None)
        if model_number:
            queryset = Asset.objects.filter(
                model_number__startswith=model_number)
            return queryset
        else:
            return (
                Asset.objects.none()
            )

# Search assest by asset ID
class AssetSearchByAssetIDView(generics.ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        asset_id = self.request.query_params.get("asset_id", None)
        if asset_id:
            queryset = Asset.objects.filter(asset_id__startswith=asset_id)
            return queryset
        else:
            return (
                Asset.objects.none()
            )
