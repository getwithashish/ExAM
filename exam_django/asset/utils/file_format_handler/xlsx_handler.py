import datetime
import io
import uuid
from django.http import HttpResponse
import openpyxl
from openpyxl.styles import NamedStyle
import pandas as pd

from asset.utils.file_format_handler.file_format_handler_abstract import (
    FileFormatHandlerAbstract,
)
from asset.models.asset import Asset


class XlsxHandler(FileFormatHandlerAbstract):

    @staticmethod
    def parse_to_csv(file_content):
        df = pd.read_excel(io.BytesIO(file_content))
        data = df.to_dict(orient="records")
        csv_reader = [dict(row) for row in data]
        return csv_reader

    @staticmethod
    def generate_from_list(csv_list):
        if csv_list:
            df = pd.DataFrame(csv_list)
            output = io.BytesIO()
            df.to_excel(output, index=False)
            output.seek(0)
        else:
            return None

        return output

    @staticmethod
    def export(assets, expiry_dates, exclude_fields, foreign_fields):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Assets"

        # Define field names and insert 'expiry_date' after 'warranty_period'
        fields = [
            field.name
            for field in Asset._meta.fields
            if field.name not in exclude_fields
        ]
        warranty_idx = fields.index("warranty_period")
        fields.insert(warranty_idx + 1, "expiry_date")

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

        # Write headers
        for idx, field in enumerate(fields, start=1):
            ws.cell(row=1, column=idx).value = field

        # Write asset details and expiry dates
        for row_idx, (asset, expiry_date) in enumerate(
            zip(assets, expiry_dates), start=2
        ):
            for col_idx, field in enumerate(fields, start=1):
                if field == "expiry_date":
                    value = expiry_date
                else:
                    value = getattr(asset, field)
                    if isinstance(value, uuid.UUID):
                        value = str(value)  # Convert UUID to string
                    elif value == "" or value is None:
                        value = ""  # Set empty string for empty values
                    elif field in foreign_fields.keys():
                        value = str(getattr(value, foreign_fields[field]))
                    elif field in ["requester", "approved_by"]:
                        # TODO This will return first name + last name, once SSO is setup correctly
                        value = str(value)
                    elif isinstance(value, datetime.datetime):
                        if field in datetime_columns:
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
