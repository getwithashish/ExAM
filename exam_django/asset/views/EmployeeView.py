from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.response import Response
from asset.serializers import EmployeeSerializer
from asset.models import Employee

class EmployeeView(ListCreateAPIView):
    def post(self, request, format=None):
        data = {}
        try:
            queryset = Employee.objects.all()
            serializer = EmployeeSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "data": serializer.data,
                        "message": "Employee successfully created",
                    },
                    status=status.HTTP_201_CREATED,
                )
            data["error"] = "Invalid request_status"
            return Response(
                {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            # Get the query parameter for the employee name
            name = request.query_params.get('name', None)
            if name:
                # Search for employees by name
                employees = Employee.objects.filter(name__startswith=name)
                serializer = EmployeeSerializer(employees, many=True)
                message = f"Employee details with name containing '{name}' successfully retrieved"
            else:
                # Get all employees if no name parameter is provided
                employees = Employee.objects.all()
                serializer = EmployeeSerializer(employees, many=True)
                message = "Employee details successfully retrieved"

            return Response(
                {
                    "data": serializer.data,
                    "message": message,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


