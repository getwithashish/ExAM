# views.py
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from asset.models import Asset,Employee
# from asset.serializers import AssignAssetSerializer,EmployeeSerializer

# class AssignAssetView(APIView):
#     def get(self, request):
#         # Implement logic to retrieve assets assigned to employees
#         assets = Asset.objects.filter(employee__isnull=False)
#         serializer = AssignAssetSerializer(assets, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = AssignAssetSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         # Implement search logic here
#         # Example:
#         employees = Employee.objects.filter(name__icontains=request.query_params.get('name'))
#         serializer = EmployeeSerializer(employees, many=True)
#         return Response(serializer.data)
 
#     def post(self, request):
#         # Implement logic to assign asset to employee
#         # Example:
#         asset_id = request.data.get('asset_id')
#         employee_id = request.data.get('employee_id')
#         try:
#             asset = Asset.objects.get(id=asset_id)
#             employee = Employee.objects.get(id=employee_id)
#             asset.employee = employee
#             asset.save()
#             return Response({'message': 'Asset assigned successfully'}, status=status.HTTP_200_OK)
#         except Asset.DoesNotExist:
#             return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
#         except Employee.DoesNotExist:
#             return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)



# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from asset.models import Asset
from asset.serializers import AssignAssestSerializer

class AssignAssetView(APIView):
    def get(self, request, asset_id):
        try:
            asset = Asset.objects.get(pk=asset_id)
        except Asset.DoesNotExist:
            return Response({"message": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignAssestSerializer(asset)
        return Response(serializer.data)

    def post(self, request, asset_id, employee_id):
        try:
            asset = Asset.objects.get(pk=asset_id)
        except Asset.DoesNotExist:
            return Response({"message": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update custodian field of the asset
        asset.custodian_id = employee_id
        asset.save()

        serializer = AssignAssestSerializer(asset)
        return Response(serializer.data)
