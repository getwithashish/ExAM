# export_csv_service.py
from django.http import HttpResponse
import csv
from asset.models import Asset
 
class ExportCSV:
    @staticmethod
    def export_csv(assets, expiry_dates):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="assets.csv"'
    
        fields = [field.name for field in Asset._meta.fields]
        fields.insert(fields.index('warranty_period') + 1, 'expiry_date')  # Insert 'expiry_date' after 'warranty_period'
    
        writer = csv.writer(response)
        writer.writerow(fields)  # CSV header
    
        for asset, expiry_date in zip(assets, expiry_dates):
            asset_values = [getattr(asset, field) for field in fields if field != 'expiry_date']  # Exclude 'expiry_date'
            asset_values.insert(fields.index('warranty_period') + 1, expiry_date)  # Insert expiry_date after 'warranty_period'
    
            writer.writerow(asset_values)  # Write row to CSV
    
        return response
