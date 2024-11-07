import csv
import io
from asset.utils.file_format_handler.file_format_handler_abstract import (
    FileFormatHandlerAbstract,
)


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
