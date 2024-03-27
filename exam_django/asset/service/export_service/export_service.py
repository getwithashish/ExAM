from django.http import HttpResponse
import csv
from asset.models import Asset


class ExportService:
    def export_asset():
        # Retrieve all assets from the database
        assets = Asset.objects.all()

        # Create CSV response
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="assets.csv"'

        # Get all fields of the Asset model
        fields = [field.name for field in Asset._meta.fields]

        # Write CSV data
        writer = csv.writer(response)
        writer.writerow(fields)  # CSV header
        for asset in assets:
            writer.writerow(
                [getattr(asset, field) for field in fields]
            )  # Write each asset to CSV

        return response
