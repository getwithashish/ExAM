import io
import zipfile


class ArchiveFileGenerator:

    @staticmethod
    def generate_zip(file_type, **kwargs):
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
