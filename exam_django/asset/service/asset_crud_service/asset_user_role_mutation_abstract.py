from abc import ABC, abstractmethod


class AssetUserRoleMutationAbstract(ABC):
    """
    Abstract base class for asset user role mutation services.
    """

    @abstractmethod
    def create_asset(self, serializer, request):
        """
        Create a new asset using the provided serializer and request.

        Args:
            serializer (Serializer): The serializer for the asset.
            request (Request): The HTTP request instance.
        """
        pass

    @abstractmethod
    def update_asset(self, serializer, asset, request):
        """
        Update the provided asset using the serializer and request.

        Args:
            serializer (Serializer): The serializer for the asset.
            asset (Asset): The asset instance.
            request (Request): The HTTP request instance.
        """
        pass
