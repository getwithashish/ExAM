# export_service.py
import datetime
import json
from rest_framework import status
from asset.service.asset_crud_service.asset_advanced_query_service_with_json_logic import (
    AssetAdvancedQueryServiceWithJsonLogic,
)
from asset.service.export_service.export_pdf_service import ExportPDF
from asset.service.asset_crud_service.asset_normal_query_service import (
    AssetNormalQueryService,
)
from asset.utils.file_format_handler.csv_handler import CsvHandler
from asset.utils.file_format_handler.xlsx_handler import XlsxHandler
from messages import EXPORT_FORMAT_NOT_SUPPORTED
from response import APIResponse


class ExportService:

    FOREIGN_FIELDS = {
        "location": "location_name",
        "invoice_location": "location_name",
        "asset_type": "asset_type_name",
        "custodian": "employee_name",
        "memory": "memory_space",
        "business_unit": "business_unit_name",
    }

    EXCLUDE_FIELDS = ["is_deleted", "version"]

    @staticmethod
    def export_asset(format: str, logic_data, request):

        asset_normal_query = AssetNormalQueryService()
        queryset = asset_normal_query.filter_queryset(request=request)

        if logic_data and logic_data != "":
            logic_data = json.loads(logic_data)
            asset_advanced_query = AssetAdvancedQueryServiceWithJsonLogic()
            q_objects = asset_advanced_query.convert_json_logic_to_django_q(logic_data)

            queryset = queryset.filter(q_objects)

        assets = queryset

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

        # Export assets based on the specified format
        if format == "csv":
            # assets_with_expiry = list(zip(assets, expiry_dates))
            file_format_handler = CsvHandler

        elif format == "xlsx":
            file_format_handler = XlsxHandler

        elif format == "pdf":
            return ExportPDF.export_pdf(assets, expiry_dates)

        else:
            return APIResponse(
                data={},
                message=EXPORT_FORMAT_NOT_SUPPORTED,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return file_format_handler.export(
            assets,
            expiry_dates,
            ExportService.EXCLUDE_FIELDS,
            ExportService.FOREIGN_FIELDS,
        )
