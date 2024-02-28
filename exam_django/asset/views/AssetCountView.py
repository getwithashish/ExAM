from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response

from asset.models import Asset
from django.db.models import Count


class AssetCountView(ListCreateAPIView):
    def list(self, request, *args, **kwargs):
        # Get a dictionary with status counts
        status_counts = Asset.objects.values(
            "status").annotate(count=Count("status"))

        # Create a response dictionary with status counts
        response_data = [
            {"status": item["status"], "count": item[
                "count"]} for item in status_counts
        ]

        # Return the response
        return Response(response_data)
