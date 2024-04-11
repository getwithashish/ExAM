
# export_service.py

import datetime
import uuid
from django.http import HttpResponse
import csv
from reportlab.lib.pagesizes import letter
import openpyxl
from io import BytesIO
from reportlab.lib import colors
from openpyxl.styles import NamedStyle
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from user_auth.models import User
from asset.models.memory import Memory
from asset.models.business_unit import BusinessUnit
from asset.models.location import Location
from asset.models.employee import Employee
from asset.models import Asset
from reportlab.platypus import Paragraph,Spacer
from reportlab.lib.styles import getSampleStyleSheet

class ExportService:
    @staticmethod
    def export_asset(format: str):
        # Retrieve all assets from the database
        assets = Asset.objects.all()

        if format == 'csv':
            return ExportService.export_csv(assets)
        elif format == 'xlsx':
            return ExportService.export_xlsx(assets)
        elif format == 'pdf':
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
        datetime_style = NamedStyle(name="datetime_style", number_format='YYYY-MM-DD HH:MM:SS')

        # Apply the datetime style to the columns containing datetime values
        datetime_columns = ['created_at', 'updated_at', 'date_of_purchase']  # Replace with the actual names of datetime fields
        for col_idx, field in enumerate(fields, start=1):
            if field in datetime_columns:
                ws.column_dimensions[openpyxl.utils.get_column_letter(col_idx)].width = 25
                ws.cell(row=1, column=col_idx).style = datetime_style

        for idx, field in enumerate(fields, start=1):
            ws.cell(row=1, column=idx).value = field

        for row_idx, asset in enumerate(assets, start=2):
            for col_idx, field in enumerate(fields, start=1):
                value = getattr(asset, field)
                if isinstance(value, uuid.UUID):
                    value = str(value)  # Convert UUID to string
                elif field == 'asset_type':
                    value = str(value)  # Assuming `asset_type` is a string representation of AssetType
                elif isinstance(value, (Employee, Location, BusinessUnit, Memory, User)):
                    value = str(value)  # Convert object to string representation
                elif value == '' or value is None:  # Check if value is an empty string or None
                    value = ''  # Set empty string for empty values
                elif isinstance(value, datetime.datetime):
                    # Format datetime as a string in a suitable format
                    if field in ['created_at', 'updated_at', 'date_of_purchase']:
                        value = value.strftime("%Y-%m-%d %H:%M:%S.%f")  # Use '%f' for microseconds
                    else:
                        value = value.strftime("%Y-%m-%d")  # Use '%Y-%m-%d' for other dates
                ws.cell(row=row_idx, column=col_idx).value = value

        response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response["Content-Disposition"] = 'attachment; filename="assets.xlsx"'
        wb.save(response)

        return response
    @staticmethod
    def export_pdf(assets):
        response = HttpResponse(content_type='application/pdf')
        response["Content-Disposition"] = 'attachment; filename="assets.pdf"'

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []

        fields = [field.name for field in Asset._meta.fields]

        data = [[getattr(asset, field) or "" for field in fields] for asset in assets]  # Ensure all values are non-null
        data.insert(0, fields)  # Insert header row

        num_columns = len(fields)
        num_rows = len(data)

        # Define column widths dynamically based on content
        col_widths = [max(len(str(row[col])) for row in data) * 4 for col in range(num_columns)]

        # Ensure that the total width of the table does not exceed the page width
        max_page_width = letter[0] - 60  # Adjust 60 as necessary for margins

        # Calculate font scaling factor based on column width
        max_font_size = 12  # Maximum font size
        min_font_size = 6   # Minimum font size
        font_scaling_factor = min(max_page_width / sum(col_widths), 1)  # Scaling factor for font size

        # Create table style with font size adjusted and word wrap
        table_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.gray),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]
        for i in range(num_columns):
            table_style.append(('FONTSIZE', (i, 0), (i, -1), max(min_font_size, max_font_size * font_scaling_factor)))
            table_style.append(('WORDWRAP', (i, 0), (i, -1)))  # Enable word wrap for each column

        # Determine the number of columns per table based on available page width
        columns_per_table = 1
        total_width = sum(col_widths[:columns_per_table])
        while total_width <= max_page_width and columns_per_table < num_columns:
            columns_per_table += 1
            total_width = sum(col_widths[:columns_per_table])

        # Calculate the column widths for each table
        table_col_widths = []
        start_col = 0
        while start_col < num_columns:
            end_col = min(start_col + columns_per_table, num_columns)
            table_width = sum(col_widths[start_col:end_col])
            scaling_factor = min(max_page_width / table_width, 1)
            table_col_widths.append([int(width * scaling_factor) for width in col_widths[start_col:end_col]])
            start_col = end_col

        # Split the data into sections of columns_per_table columns each
        start_col = 0
        while start_col < num_columns:
            end_col = min(start_col + columns_per_table, num_columns)
            section_data = [row[start_col:end_col] for row in data]

            # Create a table for the current section
            table = Table(section_data, colWidths=table_col_widths.pop(0))
            table.setStyle(TableStyle(table_style))

            elements.append(table)

            # Add spacer between sections
            start_col = end_col
            if start_col < num_columns:
                elements.append(Spacer(1, 12))

        doc.build(elements)

        pdf = buffer.getvalue()
        buffer.close()
        response.write(pdf)

        return response
