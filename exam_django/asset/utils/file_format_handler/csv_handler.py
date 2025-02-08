import csv
import io
from typing import Dict, List, Optional

from asset.models.asset import Asset
from asset.utils.file_format_handler.file_format_handler_abstract import \
    FileFormatHandlerAbstract
from django.http import HttpResponse


class CsvHandler(FileFormatHandlerAbstract):
    """
    CSV format handler for exporting assets
    """

    @staticmethod
    def parse_to_csv(file_content: bytes) -> csv.DictReader[str]:
        """
        Parses the provided file content to CSV format.

        Args:
            file_content (bytes): The content of the file to parse.

        Returns:
            DictReader[str]: Data representing CSV content.
        """

        csv_reader = csv.DictReader(file_content.decode("utf-8").splitlines())

        return csv_reader

    @staticmethod
    def generate_from_list(csv_list: List[Dict[str, str]]) -> Optional[io.StringIO]:
        """
        Generates a CSV file from a list of assets.

        Args:
            csv_list (List[Dict[str, str]]): The list of asset data to generate CSV from.

        Returns:
            Optional[io.StringIO]: A StringIO object containing the generated CSV if not empty, else None.
        """

        output = io.StringIO()
        csv_writer = csv.writer(output)

        if csv_list:
            header_row = csv_list[0].keys()
            csv_writer.writerow(header_row)

            for asset in csv_list:
                csv_writer.writerow(asset.values())
        else:
            return None

        return output

    @staticmethod
    def export(
        assets,
        expiry_dates,
        exclude_fields: List[str],
        foreign_fields
    ) -> HttpResponse:
        """
        Exports asset data as a CSV file.

        Args:
            assets: The list of assets to export.
            expiry_dates: Corresponding expiry dates for the assets.
            exclude_fields (List[str]): Fields to exclude from the export.
            foreign_fields: Foreign fields mapping for export.

        Returns:
            HttpResponse: The HTTP response containing the CSV file.
        """

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="assets.csv"'

        fields = [
            field.name
            for field in Asset._meta.fields
            if field.name not in exclude_fields
        ]
        fields.insert(
            fields.index("warranty_period") + 1, "expiry_date"
        )  # Insert 'expiry_date' after 'warranty_period'

        writer = csv.writer(response)
        writer.writerow(fields)  # CSV header

        for asset, expiry_date in zip(assets, expiry_dates):
            asset_values = []
            for field in fields:
                if field in exclude_fields:
                    continue
                if field != "expiry_date":
                    if field in foreign_fields.keys():
                        field_object = getattr(asset, field)
                        field = (
                            getattr(field_object, foreign_fields[field])
                            if field_object
                            else ""
                        )
                    else:
                        field = getattr(asset, field)
                        field = field if field else ""
                    asset_values.append(field)
            asset_values.insert(
                fields.index("warranty_period") + 1, expiry_date
            )  # Insert expiry_date after 'warranty_period'

            writer.writerow(asset_values)

        return response
