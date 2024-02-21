from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
from asset.models import Asset
from asset.serializers import AssetSerializer

class AssetSearchByModelNumberView(generics.ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        query = self.request.query_params.get('query', None)
        if query:
            queryset = Asset.objects.filter(
                Q(model_number__startswith=query) | Q(model_number__icontains=query)
            )
        else:
            queryset = Asset.objects.all()
        return queryset
