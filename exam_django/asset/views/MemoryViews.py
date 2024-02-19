from rest_framework import generics
from asset.models import Memory
from asset.serializers import MemorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class MemoryList(APIView):
    def get(self, request, format=None):
        memories = Memory.objects.all()
        serializer = MemorySerializer(memories, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MemorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

