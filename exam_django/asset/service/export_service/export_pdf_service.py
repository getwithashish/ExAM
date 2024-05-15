# export_pdf_service.py
import datetime
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, PageBreak
from asset.models import Asset
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

class ExportPDF:
    @staticmethod
    def transpose_data(data):
    #Transpose the data (swap rows and columns)
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
                transposed_data = ExportPDF.transpose_data(data)
    
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
