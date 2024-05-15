# export_service.py
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
from asset.service.export_service.export_csv_service import ExportCSV
from asset.service.export_service.export_xlsx_service import ExportXLSX
from asset.service.export_service.export_pdf_service import ExportPDF
 
class ExportService:
 
    @staticmethod
    def export_asset(format: str, logic_data):
 
        if logic_data and logic_data != "":
            logic_data =  json.loads(logic_data)
            # Convert JsonLogic expression to Django Q =objects
            asset_advanced_query = AssetAdvancedQueryServiceWithJsonLogic()
            q_objects = asset_advanced_query.convert_json_logic_to_django_q(logic_data)
            queryset = Asset.objects.all()
            queryset = queryset.filter(is_deleted=False)
            queryset = queryset.filter(q_objects)
            assets = queryset
        else:
            assets = Asset.objects.all()
 
        if format == "csv":
            return ExportCSV.export_csv(assets)
        elif format == "xlsx":
            return ExportXLSX.export_xlsx(assets)
        elif format == "pdf":
            return ExportPDF.export_pdf(assets)
        else:
            return HttpResponse("Invalid format specified", status=400)
 
    