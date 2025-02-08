import io
import zipfile
from typing import Any


class ArchiveFileGenerator:
    """
    Class to generate zip files from given input data
    """

    @staticmethod
    def generate_zip(file_type: str, **kwargs: dict[str, io.BytesIO]) -> io.BytesIO:
        zip_content = io.BytesIO()
        with zipfile.ZipFile(zip_content, "w") as zf:
            for key in kwargs.keys():
                if kwargs[key]:
                    zf.writestr(
                        f"{key}.{file_type.lower()}",
                        kwargs[key].getvalue(),
                    )

        zip_content.seek(0)

        return zip_content
