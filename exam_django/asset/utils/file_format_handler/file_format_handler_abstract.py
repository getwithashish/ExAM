from abc import ABC, abstractmethod


class FileFormatHandlerAbstract(ABC):

    @staticmethod
    @abstractmethod
    def parse_to_csv(file_content):
        pass

    @staticmethod
    @abstractmethod
    def generate_from_list(csv_list):
        pass

    @staticmethod
    @abstractmethod
    def export(assets, expiry_dates, exclude_fields, foreign_fields):
        pass
