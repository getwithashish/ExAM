from typing import Any, Dict, Tuple

from asset.models import Memory
from asset.serializers import MemorySerializer
from messages import (GLOBAL_500_EXCEPTION_ERROR, MEMORY_CREATED_UNSUCCESSFUL,
                      MEMORY_SUCCESSFULLY_CREATED,
                      MEMORY_SUCCESSFULLY_RETRIEVED)
from rest_framework import status


class MemoryService:
    """
    Service class for operations related to asset memory
    """

    @staticmethod
    def retrieve_memories(query: int=None) -> Tuple[Dict[str, Any], str, int]:
        """
        Retrieve a list of memory spaces, optionally filtering by a search query.

        Args:
            query: The search query.

        Returns:
            Tuple[Dict[str, Any], str, int]: The serialized list of memory spaces, message, and the HTTP status code.
        """

        try:
            if query:
                memories = Memory.objects.filter(memory_space__istartswith=query)

            else:
                memories = Memory.objects.all()

            serializer = MemorySerializer(memories, many=True)

            return serializer.data, MEMORY_SUCCESSFULLY_RETRIEVED, status.HTTP_200_OK

        except Exception:

            return (
                None,
                GLOBAL_500_EXCEPTION_ERROR,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def create_memory(data) -> Tuple[Dict[str, Any], str, int]:
        """
        Create a new asset memory size.

        Args:
            data: memory size data.

        Returns:
            Tuple[Dict[str, Any], str, int]: The serialized asset memory data, message, and the HTTP status code.
        """

        serializer = MemorySerializer(data=data)
        message_success = MEMORY_SUCCESSFULLY_CREATED
        message_failure = MEMORY_CREATED_UNSUCCESSFUL

        if serializer.is_valid():
            serializer.save()

            return serializer.data, message_success, status.HTTP_201_CREATED

        return serializer.errors, message_failure, status.HTTP_400_BAD_REQUEST
