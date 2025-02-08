import datetime
import io
from typing import Any, Dict, Hashable, List, Optional
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
    """
    XLSX format handler for exporting assets
    """

    @staticmethod
    def parse_to_csv(file_content: bytes) -> List[Dict[Hashable, Any]]:
        """
    Parses the content of an Excel file and converts it to a list of dictionaries.

    Each dictionary represents a row in the Excel file, where the keys are the column headers.

    Args:
        file_content (bytes): The content of the Excel file as a byte stream.

    Returns:
        List[Dict[Hashable, Any]]: A list of dictionaries representing the rows of the Excel file.
    """

        df = pd.read_excel(io.BytesIO(file_content))
        data = df.to_dict(orient="records")
        csv_reader = [dict(row) for row in data]

        return csv_reader

    @staticmethod
    def generate_from_list(csv_list) -> Optional[io.BytesIO]:
        """
        Generates an Excel file from a list of data.

        This method takes a list of data and converts it into an Excel file format. The resulting Excel file is stored in a BytesIO stream.

        Parameters:
            csv_list (list): A list of data to be converted into an Excel file. Each item in the list should correspond to a row in the resulting Excel file.

        Returns:
            Optional[io.BytesIO]: A BytesIO object containing the Excel file if the input list is not empty; returns None if the input list is empty.
        """

        if csv_list:
            df = pd.DataFrame(csv_list)
            output = io.BytesIO()
            df.to_excel(output, index=False)
            output.seek(0)
        else:
            return None

        return output

    @staticmethod
    def export(assets, expiry_dates, exclude_fields: List[str], foreign_fields) -> HttpResponse:
        """
        Exports asset data as a XLSX file.

        Args:
            assets: The list of assets to export.
            expiry_dates: Corresponding expiry dates for the assets.
            exclude_fields (List[str]): Fields to exclude from the export.
            foreign_fields: Foreign fields mapping for export.

        Returns:
            HttpResponse: The HTTP response containing the XLSX file.
        """

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
