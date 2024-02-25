from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from asset.models import Asset
from django.db.models import Count


class AssetCountView(ListCreateAPIView):
    def list(self, request, *args, **kwargs):
        # Get counts for hardware assets
        hardware_counts = Asset.objects.filter(asset_category="HARDWARE", approval_status="APPROVED").values("status").annotate(count=Count("status"))
        
        # Get counts for software assets
        software_counts = Asset.objects.filter(asset_category="SOFTWARE", approval_status="APPROVED").values("status").annotate(count=Count("status"))

        # Create a response dictionary with counts for hardware and software separately
        response_data = {
            "hardware": [
                {"status": item["status"], "count": item["count"]} for item in hardware_counts
            ],
            "software": [
                {"status": item["status"], "count": item["count"]} for item in software_counts
            ]
        }

        # Return the response
        return Response(response_data)

