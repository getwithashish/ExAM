from abc import ABC, abstractmethod


class AiClientAbstract(ABC):

    @abstractmethod
    def generate_response(self, prompt):
        pass
