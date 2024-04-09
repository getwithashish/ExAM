# from django.http import HttpResponse
# import csv
# from asset.models import Asset


# class ExportService:
#     def export_asset():
#         # Retrieve all assets from the database
#         assets = Asset.objects.all()

#         # Create CSV response
#         response = HttpResponse(content_type="text/csv")
#         response["Content-Disposition"] = 'attachment; filename="assets.csv"'

#         # Get all fields of the Asset model
#         fields = [field.name for field in Asset._meta.fields]

#         # Write CSV data
#         writer = csv.writer(response)
#         writer.writerow(fields)  # CSV header
#         for asset in assets:
#             writer.writerow(
#                 [getattr(asset, field) for field in fields]
#             )  # Write each asset to CSV

#         return response








# export_service.py

from django.http import HttpResponse
import csv
import openpyxl
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from asset.models import Asset

class ExportService:
    @staticmethod
    def export_asset(format):
        
      

        # Retrieve all assets from the database
        assets = Asset.objects.all()

        if format == 'csv':
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

        elif format == 'xlsx':
            # Create XLSX response
            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = "Assets"

            # Get all fields of the Asset model
            fields = [field.name for field in Asset._meta.fields]

            # Write XLSX header
            for idx, field in enumerate(fields, start=1):
                ws.cell(row=1, column=idx).value = field

            # Write XLSX data
            for row_idx, asset in enumerate(assets, start=2):
                for col_idx, field in enumerate(fields, start=1):
                    ws.cell(row=row_idx, column=col_idx).value = getattr(asset, field)

            response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            response["Content-Disposition"] = 'attachment; filename="assets.xlsx"'
            wb.save(response)

            return response

        elif format == 'pdf':
            # Create PDF response
            response = HttpResponse(content_type='application/pdf')
            response["Content-Disposition"] = 'attachment; filename="assets.pdf"'

            # Create a PDF document
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []

            # Get all fields of the Asset model
            fields = [field.name for field in Asset._meta.fields]

            # Prepare data for PDF table
            data = [[getattr(asset, field) for field in fields] for asset in assets]
            data.insert(0, fields)  # Insert header row

            # Create PDF table
            table = Table(data)
            table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.gray),
                                       ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                                       ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                                       ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                                       ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                                       ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                                       ('GRID', (0, 0), (-1, -1), 1, colors.black)]))

            elements.append(table)
            doc.build(elements)

            # Get PDF content from buffer and write it to response
            pdf = buffer.getvalue()
            buffer.close()
            response.write(pdf)

            return response

        else:
            return HttpResponse("Invalid format specified", status=400)
