from django.http import HttpResponse
import csv
from rest_framework.views import APIView
from asset.models import Asset


class AssetExportView(APIView):

    def get(self, request):
        # Retrieve all assets from the database
        assets = Asset.objects.all()

        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="assets.csv"'

        # Get all fields of the Asset model
        fields = [field.name for field in Asset._meta.fields]

        # Write CSV data
        writer = csv.writer(response)
        writer.writerow(fields)  # CSV header
        for asset in assets:
            writer.writerow([getattr(asset, field) for field in fields])  # Write each asset to CSV

        return response
