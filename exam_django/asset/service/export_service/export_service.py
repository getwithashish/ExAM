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
from reportlab.lib.pagesizes import letter
import openpyxl
from io import BytesIO
from reportlab.lib import colors
from openpyxl.styles import NamedStyle
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, PageBreak
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
            return ExportService.export_csv(assets)
        elif format == "xlsx":
            return ExportService.export_xlsx(assets)
        elif format == "pdf":
            return ExportService.export_pdf(assets)
        else:
            return HttpResponse("Invalid format specified", status=400)
 
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
   
   
    @staticmethod
    def transpose_data(data):
        # Transpose the data (swap rows and columns)
        transposed_data = list(map(list, zip(*data)))
        return transposed_data
 
    @staticmethod
    def export_pdf(assets):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="assets.pdf"'
 
        buffer = BytesIO()
 
        # Set mandatory margins and available width for the PDF document
        left_margin = 30
        right_margin = 30
        top_margin = 30
        bottom_margin = 30
        available_width = letter[0] - left_margin - right_margin
 
        # Initialize SimpleDocTemplate with specified margins
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=left_margin,
            rightMargin=right_margin,
            topMargin=top_margin,
            bottomMargin=bottom_margin,
        )
 
        elements = []
 
        heading_style = ParagraphStyle(
            name='Heading1',
            fontName='Helvetica-Bold',
            fontSize=14,
            alignment=1,
            spaceAfter=12
        )
        elements.append(Paragraph("Asset Details", heading_style))
 
        excluded_fields = ["asset_uuid", "is_deleted"]
        fields = [field.name.capitalize() for field in Asset._meta.fields if field.name not in excluded_fields]
 
        assets_per_page = 6  # Adjust assets per page as needed
        num_assets = len(assets)
 
        for i in range(0, num_assets, assets_per_page):
            page_assets = assets[i:i + assets_per_page]
 
            # Prepare data for the table
            data = [fields]
            for asset in page_assets:
                row = []
                for field in fields:
                    value = getattr(asset, field.lower(), "")
                    if field.lower() in ["created_at", "updated_at"]:
                        # Apply text wrapping to created_at and updated_at fields
                        value = Paragraph(str(value), style=ParagraphStyle(name='Normal', wordWrap=True))
                    elif isinstance(value, datetime.datetime) and field.lower() in ["created_at", "updated_at"]:
                        value = value.strftime("%Y-%m-%d %H:%M:%S")
                    row.append(value)
                data.append(row)
 
            # Transpose the data (swap rows and columns)
            transposed_data = ExportService.transpose_data(data)
 
            # Calculate column widths based on content and available width
            col_widths = [max(len(str(cell)) * 8 for cell in col) for col in transposed_data]
 
            # Create a table from the transposed data with adjusted column widths
            table_data = []
            for row in transposed_data:
                table_row = []
                for idx, cell in enumerate(row):
                    if isinstance(cell, str) and '\n' in cell:
                        cell = cell.replace('\n', '<br/>')
 
                    table_row.append(cell)
                table_data.append(table_row)
 
            table = Table(table_data, colWidths=col_widths)
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.gray),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 12),
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("TOPPADDING", (0, 0), (-1, -1), 10),  # Increase top padding
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),  # Increase bottom padding
                ("LEFTPADDING", (0, 0), (-1, -1), 10),  # Increase left padding
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),  # Increase right padding
            ]))
 
            # Add the table to elements
            elements.append(table)
 
            # Add page break if not the last page
            if i + assets_per_page < num_assets:
                elements.append(PageBreak())
 
        # Build the PDF document
        doc.build(elements)
 
        # Write PDF content to response
        pdf = buffer.getvalue()
        buffer.close()
        response.write(pdf)
 
        return response
