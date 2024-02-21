# from rest_framework import generics
# from asset.models import Asset
# from asset.serializers import AssetSerializer

# class AssetSearchByAssetID(generics.RetrieveAPIView):
#     queryset = Asset.objects.all()
#     serializer_class = AssetSerializer
#     lookup_field = 'asset_id'  # Specify the field to use for lookup

#     def get_object(self):
#         queryset = self.filter_queryset(self.get_queryset())
#         # Use `lookup_field` to filter objects by asset_id
#         filter_kwargs = {self.lookup_field: self.kwargs['asset_id']}
#         obj = generics.get_object_or_404(queryset, **filter_kwargs)
#         self.check_object_permissions(self.request, obj)
#         return obj


from rest_framework import generics
from django.shortcuts import get_object_or_404
from asset.models import Asset
from asset.serializers import AssetSerializer

class AssetSearchByAssetIDView(generics.RetrieveAPIView):
    serializer_class = AssetSerializer
    lookup_field = 'asset_id'  # Specify the field to use for lookup

    def get_object(self):
        asset_id = self.request.query_params.get('asset_id')
        queryset = Asset.objects.all()
        obj = get_object_or_404(queryset, **{self.lookup_field: asset_id})
        self.check_object_permissions(self.request, obj)
        return obj
