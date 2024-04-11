from abc import ABC, abstractmethod


class AssetQueryAbstract(ABC):

    @abstractmethod
    def get_asset_details(self, serializer, request):
        pass
