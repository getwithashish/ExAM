from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import BusinessUnitSerializer
from asset.models import BusinessUnit


class BusinessUnitView(ListCreateAPIView):
    def post(self, request, format=None):
        serializer = BusinessUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = {
                'data': serializer.data,
                'message': "Business unit created successfully"
            }
            return Response(data, status=status.HTTP_201_CREATED)
        errors = serializer.errors
        return Response({'error': errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        business_units = BusinessUnit.objects.all()
        serializer = BusinessUnitSerializer(business_units, many=True)
        data = {
            'data': serializer.data,
            'message': "Business units retrieved successfully"
        }
        return Response(data)
