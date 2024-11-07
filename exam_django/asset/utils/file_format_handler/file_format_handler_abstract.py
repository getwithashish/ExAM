from abc import ABC


class FileFormatHandlerAbstract(ABC):

    @staticmethod
    def parse_to_csv(file_content):
        pass

    @staticmethod
    def generate_from_list(csv_list):
        pass
