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
            # Filtering assets based on serial number starting with the provided value
            queryset = Asset.objects.filter(serial_number__startswith=serial_number)
            return queryset
        else:
            return (
                Asset.objects.none()
            )  # Return an empty queryset if no serial number provided


# Search based on model number
class AssetSearchByModelNumberView(generics.ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        query = self.request.query_params.get("query", None)
        if query:
            queryset = Asset.objects.filter(
                Q(model_number__startswith=query) | Q(model_number__icontains=query)
            )
        else:
            queryset = Asset.objects.all()
        return queryset


# Search assest by asset ID
class AssetSearchByAssetIDView(generics.RetrieveAPIView):
    serializer_class = AssetSerializer
    lookup_field = "asset_id"

    def get_object(self):
        asset_id = self.request.query_params.get("asset_id")
        queryset = Asset.objects.all()
        obj = get_object_or_404(queryset, **{self.lookup_field: asset_id})
        self.check_object_permissions(self.request, obj)
        return obj
