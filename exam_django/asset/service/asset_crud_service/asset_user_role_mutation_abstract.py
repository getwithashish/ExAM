from abc import ABC, abstractmethod


class AssetUserRoleMutationAbstract(ABC):

    @abstractmethod
    def create_asset(self):
        pass
