import csv
import io

from django.http import HttpResponse
from asset.utils.file_format_handler.file_format_handler_abstract import (
    FileFormatHandlerAbstract,
)
from asset.models.asset import Asset


class CsvHandler(FileFormatHandlerAbstract):

    @staticmethod
    def parse_to_csv(file_content):
        csv_reader = csv.DictReader(file_content.decode("utf-8").splitlines())
        return csv_reader

    @staticmethod
    def generate_from_list(csv_list):
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
    def export(assets, expiry_dates, exclude_fields, foreign_fields):
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

            writer.writerow(asset_values)  # Write row to CSV

        return response
