from abc import ABC, abstractmethod


class EmployeeDataSourceClientAbstract(ABC):

    @staticmethod
    @abstractmethod
    def retrieve_users():
        pass

    @staticmethod
    @abstractmethod
    def get_user_count():
        pass

    @staticmethod
    @abstractmethod
    def get_user_changes():
        pass

    @staticmethod
    @abstractmethod
    def construct_employee():
        pass

    @staticmethod
    @abstractmethod
    def construct_delta_employees():
        pass
