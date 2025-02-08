from abc import ABC, abstractmethod
from typing import List


class FileFormatHandlerAbstract(ABC):
    """
    Abstract base class for handling different file formats for export
    """

    @staticmethod
    @abstractmethod
    def parse_to_csv(file_content):
        """
        Parses the given file content to a CSV format.

        Args:
            file_content: The content of the file to be parsed.
        """

        pass

    @staticmethod
    @abstractmethod
    def generate_from_list(csv_list):
        pass

    @staticmethod
    @abstractmethod
    def export(assets, expiry_dates, 
               exclude_fields: List[str], foreign_fields):
        """
        Exports the given assets and their expiry dates to a specific format, 
        excluding certain fields.

        Args:
            assets: The assets to be exported.
            expiry_dates: The respective expiry dates for the assets.
            exclude_fields (List[str]): Fields to exclude from the export.
            foreign_fields (List[str]): Fields related to foreign assets.
        """

        pass
