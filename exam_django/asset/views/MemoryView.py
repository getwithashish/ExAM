# from asset.models import Memory
# from asset.serializers import MemorySerializer
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from response import APIResponse
# from rest_framework import status
# from messages import (
#     MEMORY_CREATION_SUCCESSFUL,
#     MEMORY_CREATION_UNSUCCESSFUL,
# )


# class MemoryView(APIView):
#     def get(self, request, format=None):
#         memories = Memory.objects.all()
#         serializer = MemorySerializer(memories, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = MemorySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()

#             return APIResponse(
#                 data=serializer.data,
#                 message=MEMORY_CREATION_SUCCESSFUL,
#                 status=status.HTTP_201_CREATED,
#             )

#         return APIResponse(
#             data=serializer.errors,
#             message=MEMORY_CREATION_UNSUCCESSFUL,
#             status=status.HTTP_400_BAD_REQUEST,
#         )


from asset.models import Memory
from asset.serializers import MemorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from messages import MEMORY_CREATION_SUCCESSFUL, MEMORY_CREATION_UNSUCCESSFUL


class MemoryView(APIView):
    def get(self, request, format=None):
        memories = Memory.objects.all()
        serializer = MemorySerializer(memories, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MemorySerializer(data=request.data)
        if serializer.is_valid():
            # Check if memory with the same attributes already exists
            memory_exists = Memory.objects.filter(**serializer.validated_data).exists()
            if memory_exists:
                return Response(
                    {"message": "Memory already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer.save()
            return Response(
                data=serializer.data,
                message=MEMORY_CREATION_SUCCESSFUL,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            data=serializer.errors,
            message=MEMORY_CREATION_UNSUCCESSFUL,
            status=status.HTTP_400_BAD_REQUEST,
        )
