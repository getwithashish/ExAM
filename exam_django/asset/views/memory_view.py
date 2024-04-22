from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from response import APIResponse
from messages import (
    GLOBAL_500_EXCEPTION_ERROR,
)
from asset.service.memory_crud_service.memory_service import MemoryService
from rest_framework import status


class MemoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            query = request.query_params.get("query")
            memories, message, http_status = MemoryService.retrieve_memories(query)
            return APIResponse(
                data=memories,
                message=message,
                status=http_status,
            )
        except Exception:
            return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None):
        data = request.data
        memory, message, http_status = MemoryService.create_memory(data)
        return APIResponse(
            data=memory,
            message=message,
            status=http_status,
        )
