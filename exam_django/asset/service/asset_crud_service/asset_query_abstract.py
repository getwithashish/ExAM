from abc import ABC, abstractmethod
from typing import Tuple
from rest_framework.request import Request
from rest_framework.serializers import Serializer


class AssetQueryAbstract(ABC):
    """
    Abstract base class for retrieving asset details.
    """

    @abstractmethod
    def get_asset_details(self, serializer, request) -> Tuple:
        """
        Retrieve asset details based on the provided serializer and request.

        Args:
            serializer (Serializer): The serializer used to serialize the asset data.
            request (Request): The request object containing query parameters.

        Returns:
            tuple: A tuple containing the serialized asset data, success message, and HTTP status.
        """
        pass
