# export_csv_service.py
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