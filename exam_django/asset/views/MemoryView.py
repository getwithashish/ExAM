from asset.models import Memory
from asset.serializers import MemorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from response import APIResponse
from messages import(
MEMORY_SUCCESSFULLY_RETRIEVED,
GLOBAL_500_EXCEPTION_ERROR,
MEMORY_SUCCESSFULLY_CREATED,
MEMORY_CREATED_UNSUCCESSFUL
)


class MemoryView(APIView):
    def get(self, request, format=None):
        try:
            query = request.query_params.get("query")
            if query:
                memories = Memory.objects.filter(memory_space=query)
            else:
                memories = Memory.objects.all()

            serializer = MemorySerializer(memories, many=True)
            return APIResponse(
                data=serializer.data,
                message=MEMORY_SUCCESSFULLY_RETRIEVED,
                status=status.HTTP_200_OK,
            )

        except Exception:
          return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None):
        serializer = MemorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return APIResponse(
                    data=serializer.data,
                    message=MEMORY_SUCCESSFULLY_CREATED,
                    status=status.HTTP_201_CREATED,
                )
        return APIResponse(
                data=serializer.errors,
                message=MEMORY_CREATED_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )