from abc import ABC, abstractmethod


class NotificationHandlerAbstract(ABC):

    @staticmethod
    @abstractmethod
    def send_notification():
        pass

    @staticmethod
    @abstractmethod
    def get_recipient_addresses():
        pass
