import io
import pandas as pd

from asset.utils.file_format_handler.file_format_handler_abstract import (
    FileFormatHandlerAbstract,
)


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
