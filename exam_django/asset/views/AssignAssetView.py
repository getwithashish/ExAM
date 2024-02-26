from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from asset.models import Asset, Employee
from asset.serializers import EmployeeSerializer
from rest_framework.generics import ListAPIView
from django.http import JsonResponse

class AssetSearchByNameView(ListAPIView):
    def get(self, request):
        query_param = request.GET.get("q")
        if query_param:
            employees = Employee.objects.filter(employee_name__icontains=query_param)
        else:
            employees = Employee.objects.all()
 
        data = list(employees.values())
        return JsonResponse(data, safe=False)

class AssignAssetView(APIView):
    def post(self, request):
        asset_id = request.data.get("asset_uuid")
        employee_name = request.data.get("employee_name")
        
        # Search for employee by name
        try:
            employee = Employee.objects.get(employee_name=employee_name)
        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Assign asset to the found employee
        try:
            asset = Asset.objects.get(asset_uuid=asset_id)
            asset.custodian = employee
            asset.save()
            return Response(
                {"message": "Asset assigned successfully"}, status=status.HTTP_200_OK
            )
        except Asset.DoesNotExist:
            return Response(
                {"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND
            )

# class AssignAssetView(APIView):

#     def post(self, request):
#         asset_id = request.data.get("asset_uuid")
#         employee_name = request.data.get("employee_name")
#         try:
            
#             employee = Employee.objects.get(employee_name=employee_name)
#             asset = Asset.objects.get(asset_uuid=asset_id)
#             asset.custodian = employee
#             asset.save()
#             return Response(
#                 {"message": "Asset assigned successfully"}, status=status.HTTP_200_OK
#             )
#         except Asset.DoesNotExist:
#             return Response(
#                 {"error": "Asset not found"}, status=status.HTTP_404_NOT_FOUND
#             )
#         except Employee.DoesNotExist:
#             return Response(
#                 {"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND
#             )
