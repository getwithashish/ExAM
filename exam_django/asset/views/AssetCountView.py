from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from asset.models import Asset
from django.db.models import Count


class AssetCountView(ListAPIView):
    def list(self, request, *args, **kwargs):
        status_counts = Asset.objects.values("status").annotate(count=Count("status"))
        response_data = [
            {"status": item["status"], "count": item["count"]} for item in status_counts
        ]
        return Response(response_data)
