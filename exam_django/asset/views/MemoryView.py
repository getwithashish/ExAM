from asset.models import Memory
from asset.serializers import MemorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class MemoryView(APIView):
    def get(self, request, format=None):
        try:
            query = request.query_params.get("query")
            if query:
                memories = Memory.objects.filter(memory_space=query)
            else:
                memories = Memory.objects.all()

            serializer = MemorySerializer(memories, many=True)
            return Response(serializer.data)

        except Exception:
            return Response(
                "Sorry, we encountered an error",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None):
        serializer = MemorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
