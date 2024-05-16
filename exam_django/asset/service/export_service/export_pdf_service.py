# export_pdf_service.py
import datetime
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, PageBreak, Paragraph
from reportlab.lib.styles import ParagraphStyle
from asset.models import Asset
 
class ExportPDF:
    @staticmethod
    def transpose_data(data):
        # Transpose the data (swap rows and columns)
        transposed_data = list(map(list, zip(*data)))
        return transposed_data
   
    @staticmethod
    def export_pdf(assets, expiry_dates):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="assets.pdf"'
   
        buffer = BytesIO()
   
        left_margin = 30
        right_margin = 30
        top_margin = 30
        bottom_margin = 30
        available_width = letter[0] - left_margin - right_margin
   
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
        fields.append("Expiry Dates")  # Add "Expiry Dates" as a new field
   
        assets_per_page = 6
        num_assets = len(assets)
   
        for i in range(0, num_assets, assets_per_page):
            page_assets = assets[i:i + assets_per_page]
            page_expiry_dates = expiry_dates[i:i + assets_per_page]  # Corresponding expiry dates for the current page
   
            # Prepare data for the table
            data = [fields]
            for asset, expiry_date in zip(page_assets, page_expiry_dates):
                row = []
                for field in fields:
                    value = getattr(asset, field.lower(), "")
                    if field.lower() in ["created_at", "updated_at","configuration","accessories", "notes","date_of_purchase","asset_detail_status","approval_status_message","assign_status","custodian","product"]:
                        # Apply text wrapping to created_at and updated_at fields
                        value = Paragraph(str(value), style=ParagraphStyle(name='Normal', wordWrap=True))
                    elif isinstance(value, datetime.datetime):
                        value = value.strftime("%Y-%m-%d %H:%M:%S")
                    elif isinstance(value, datetime.date):
                        value = value.strftime("%Y-%m-%d")
                    elif field.lower() == "expiry dates":
                        value = expiry_date.strftime("%Y-%m-%d") if isinstance(expiry_date, datetime.date) else ""
                    row.append(value)
                data.append(row)
   
            # Transpose the data (swap rows and columns)
            transposed_data = ExportPDF.transpose_data(data)

             # Move the "Product_name" row to the top
            transposed_data = [transposed_data[fields.index("Product_name")]] + [
                transposed_data[i] for i in range(len(transposed_data)) if i != fields.index("Product_name")]
   
            # Calculate column widths based on content and available width
            col_widths = [max(len(str(cell)) * 8 for cell in col) for col in transposed_data]
   
            # Create a table from the transposed data with adjusted column widths
            table_data = []
            for row in transposed_data:
                table_row = []
                for idx, cell in enumerate(row):
                    if isinstance(cell, str) and '\n' in cell:
                        cell = cell.replace('\n', '<br/>')
                    if idx == 0:  # Apply text wrapping to the first column (headers)
                        cell = Paragraph(str(cell), style=ParagraphStyle(name='Normal', wordWrap=True))
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
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
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
 