from rest_framework.generics import ListAPIView
from asset.models import Asset
from asset.serializers import AssetSerializer


class AssetSearchBySerialNumberAPIView(ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        serial_number = self.request.query_params.get('serial_number', None)
        if serial_number:
            # Filtering assets based on serial number starting with the provided value
            queryset = Asset.objects.filter(serial_number__startswith=serial_number)
            return queryset
        else:
            return Asset.objects.none()  # Return an empty queryset if no serial number provided
