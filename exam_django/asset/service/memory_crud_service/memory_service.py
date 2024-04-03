from asset.models import Memory
from asset.serializers import MemorySerializer
from messages import (
    MEMORY_SUCCESSFULLY_RETRIEVED,
    GLOBAL_500_EXCEPTION_ERROR,
    MEMORY_SUCCESSFULLY_CREATED,
    MEMORY_CREATED_UNSUCCESSFUL,
)
from rest_framework import status


class MemoryService:
    @staticmethod
    def retrieve_memories(query=None):
        try:
            if query:
                memories = Memory.objects.filter(memory_space=query)
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
    def create_memory(data):
        serializer = MemorySerializer(data=data)
        message_success = MEMORY_SUCCESSFULLY_CREATED
        message_failure = MEMORY_CREATED_UNSUCCESSFUL
        if serializer.is_valid():
            serializer.save()
            return serializer.data, message_success, status.HTTP_201_CREATED
        return serializer.errors, message_failure, status.HTTP_400_BAD_REQUEST
