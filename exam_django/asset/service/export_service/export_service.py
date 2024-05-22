# export_service.py
import datetime
import json
import uuid
from django.http import HttpResponse
from asset.models import Asset
from asset.service.asset_crud_service.asset_advanced_query_service_with_json_logic import (
    AssetAdvancedQueryServiceWithJsonLogic,
)
from asset.service.export_service.export_csv_service import ExportCSV
from asset.service.export_service.export_xlsx_service import ExportXLSX
from asset.service.export_service.export_pdf_service import ExportPDF


class ExportService:

    @staticmethod
    def export_asset(format: str, logic_data):

        if logic_data and logic_data != "":
            logic_data = json.loads(logic_data)
            # Convert JsonLogic expression to Django Q =objects
            asset_advanced_query = AssetAdvancedQueryServiceWithJsonLogic()
            q_objects = asset_advanced_query.convert_json_logic_to_django_q(logic_data)
            queryset = Asset.objects.all().filter(is_deleted=False)

            queryset = queryset.filter(is_deleted=False)
            queryset = queryset.filter(q_objects)
            assets = queryset
        else:
            assets = Asset.objects.all().filter(is_deleted=False)

        # Calculate 'expiry_dates' for each asset
        expiry_dates = []
        for asset in assets:
            date_of_purchase = asset.date_of_purchase
            warranty_months = asset.warranty_period

            # Calculate expiry date by adding warranty period (in months) to date of purchase
            if date_of_purchase and warranty_months is not None:
                expiry_date = date_of_purchase + datetime.timedelta(
                    days=30 * warranty_months
                )
                expiry_dates.append(expiry_date)
            else:
                # Handle the case where date_of_purchase or warranty_period is None
                expiry_dates.append(None)
        # Print expiry dates for debugging
        print("Expiry Dates:")
        for expiry_date in expiry_dates:
            print(expiry_date)

        # Export assets based on the specified format
        if format == "csv":

            assets_with_expiry = list(zip(assets, expiry_dates))
            return ExportCSV.export_csv(assets, expiry_dates)
        elif format == "xlsx":

            return ExportXLSX.export_xlsx(assets, expiry_dates)
        elif format == "pdf":

            return ExportPDF.export_pdf(assets, expiry_dates)
        else:
            return HttpResponse("Invalid format specified", status=400)
