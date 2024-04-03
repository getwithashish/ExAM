from abc import ABC, abstractmethod


class AssetUserRoleMutationAbstract(ABC):

    @abstractmethod
    def create_asset(self, serializer, request):
        pass

    @abstractmethod
    def update_asset(self, serializer, asset, request):
        pass
