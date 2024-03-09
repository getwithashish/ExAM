from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from asset.serializers import BusinessUnitSerializer
from asset.models import BusinessUnit
# from exam_django.asset.views.CsvFileImportView import parse_and_add_assets


class BusinessUnitView(ListCreateAPIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        elif self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request, format=None):
        try:
            serializer = BusinessUnitSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "data": serializer.data,
                        "message": "Business unit created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            business_units = BusinessUnit.objects.all()
            serializer = BusinessUnitSerializer(business_units, many=True)
            # parse_and_add_assets()
            return Response(
                {
                    "data": serializer.data,
                    "message": "Business units details successfully retrieved",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
