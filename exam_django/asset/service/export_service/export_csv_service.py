# export_csv_service.py
from django.http import HttpResponse
import csv
from asset.models import Asset
 
class ExportCSV:
    @staticmethod
    def export_csv(assets):
            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = 'attachment; filename="assets.csv"'
    
            fields = [field.name for field in Asset._meta.fields]
    
            writer = csv.writer(response)
            writer.writerow(fields)  # CSV header
            for asset in assets:
                writer.writerow([getattr(asset, field) for field in fields])
    
            return response