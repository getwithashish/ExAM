from rest_framework.generics import RetrieveUpdateAPIView

from asset.models import Asset
from asset.serializers import AssetSerializer


class AssetDetailsView(RetrieveUpdateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
