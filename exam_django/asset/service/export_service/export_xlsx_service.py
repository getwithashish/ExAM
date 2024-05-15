# export_xlsx_service.py
import datetime
import json
import uuid
from django.http import HttpResponse
import csv
from reportlab.lib.pagesizes import letter
import openpyxl
from io import BytesIO
from reportlab.lib import colors
from openpyxl.styles import NamedStyle
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle,KeepTogether
from user_auth.models import User
from asset.models.memory import Memory
from asset.models.business_unit import BusinessUnit
from asset.models.location import Location
from asset.models.employee import Employee
from asset.models import Asset
from reportlab.platypus import Paragraph
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from asset.service.asset_crud_service.asset_advanced_query_service_with_json_logic import (
    AssetAdvancedQueryServiceWithJsonLogic,
)

class ExportXLSX:
    @staticmethod
    def export_xlsx(assets):
            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = "Assets"
    
            fields = [field.name for field in Asset._meta.fields]
    
            # Create a named style for datetime formatting
            datetime_style = NamedStyle(
                name="datetime_style", number_format="YYYY-MM-DD HH:MM:SS"
            )
    
            # Apply the datetime style to the columns containing datetime values
            datetime_columns = [
                "created_at",
                "updated_at",
                "date_of_purchase",
            ]  # Replace with the actual names of datetime fields
            for col_idx, field in enumerate(fields, start=1):
                if field in datetime_columns:
                    ws.column_dimensions[
                        openpyxl.utils.get_column_letter(col_idx)
                    ].width = 25
                    ws.cell(row=1, column=col_idx).style = datetime_style
    
            for idx, field in enumerate(fields, start=1):
                ws.cell(row=1, column=idx).value = field
    
            for row_idx, asset in enumerate(assets, start=2):
                for col_idx, field in enumerate(fields, start=1):
                    value = getattr(asset, field)
                    if isinstance(value, uuid.UUID):
                        value = str(value)  # Convert UUID to string
                    elif field == "asset_type":
                        value = str(
                            value
                        )  # Assuming `asset_type` is a string representation of AssetType
                    elif isinstance(
                        value, (Employee, Location, BusinessUnit, Memory, User)
                    ):
                        value = str(value)  # Convert object to string representation
                    elif (
                        value == "" or value is None
                    ):  # Check if value is an empty string or None
                        value = ""  # Set empty string for empty values
                    elif isinstance(value, datetime.datetime):
                        # Format datetime as a string in a suitable format
                        if field in ["created_at", "updated_at", "date_of_purchase"]:
                            value = value.strftime(
                                "%Y-%m-%d %H:%M:%S.%f"
                            )  # Use '%f' for microseconds
                        else:
                            value = value.strftime(
                                "%Y-%m-%d"
                            )  # Use '%Y-%m-%d' for other dates
                    ws.cell(row=row_idx, column=col_idx).value = value
    
            response = HttpResponse(
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            response["Content-Disposition"] = 'attachment; filename="assets.xlsx"'
    
            wb.save(response)
    
            return response