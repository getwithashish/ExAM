from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from asset.models import Asset, Employee
from asset.serializers import AssignAssetSerializer, EmployeeSerializer

class AssignAssetView(APIView):
 
   from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from asset.models import Asset, Employee
from asset.serializers import AssignAssetSerializer, EmployeeSerializer
 
class AssignAssetView(APIView):
 
    def post(self, request):
        asset_id = request.data.get('asset_uuid')
        employee_name = request.data.get('employee_name')
        try:
            # Retrieve the Employee object based on employee_name
            employee = Employee.objects.get(employee_name=employee_name)
           
            # Retrieve the Asset object based on asset_id
            asset = Asset.objects.get(asset_uuid=asset_id)
           
            # Assign the employee instance to the custodian field of the Asset model
            asset.custodian = employee
           
            # Save the changes to the asset
            asset.save()
           
            return Response({'message': 'Asset assigned successfully'}, status=status.HTTP_200_OK)
        except Asset.DoesNotExist:
            return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
 
 



















# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from asset.models import Asset, Employee
# from asset.serializers import AssignAssetSerializer, EmployeeSerializer

# class AssignAssetView(APIView):
 
#     def post(self, request):
#         asset_id = request.data.get('asset_uuid')
#         employee_name = request.data.get('employee_name')
#         try:
#             # Retrieve the Employee object based on employee_name
#             employee = Employee.objects.get(employee_name=employee_name)
            
#             # Retrieve the Asset object based on asset_id
#             asset = Asset.objects.get(asset_uuid=asset_id)
            
#             # Assign the value of employee_name to the custodian field of the Asset model
#             asset.custodian = employee.employee_name
            
#             # Save the changes to the asset
#             asset.save()
            
#             return Response({'message': 'Asset assigned successfully'}, status=status.HTTP_200_OK)
#         except Asset.DoesNotExist:
#             return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
#         except Employee.DoesNotExist:
#             return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

















# # # views.py
# # from rest_framework import status
# # from rest_framework.response import Response
# # from rest_framework.views import APIView
# # from asset.models import Asset,Employee
# # from asset.serializers import AssignAssetSerializer,EmployeeSerializer

# # class AssignAssetView(APIView):
 
# #     def post(self, request):
# #         asset_id = request.data.get('asset_uuid')
# #         employee_name = request.data.get('employee_name')
# #         try:
# #             asset = Asset.objects.get(asset_uuid=asset_id)
# #             employee = Employee.objects.get(employee_name=employee_name)
# #             asset.employee = employee
# #             asset.save()
# #             return Response({'message': 'Asset assigned successfully'}, status=status.HTTP_200_OK)
# #         except Asset.DoesNotExist:
# #             return Response({'error': 'Asset not found'}, status=status.HTTP_404_NOT_FOUND)
# #         except Employee.DoesNotExist:
# #             return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)



# # # views.py
# # # from rest_framework import status
# # # from rest_framework.response import Response
# # # from rest_framework.views import APIView
# # # from asset.models import Asset
# # # from asset.serializers import AssignAssestSerializer

# # # class AssignAssetView(APIView):
# # #     def get(self, request, asset_id):
# # #         try:
# # #             asset = Asset.objects.get(pk=asset_id)
# # #         except Asset.DoesNotExist:
# # #             return Response({"message": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

# # #         serializer = AssignAssestSerializer(asset)
# # #         return Response(serializer.data)

# # #     def post(self, request, asset_id, employee_id):
# # #         try:
# # #             asset = Asset.objects.get(pk=asset_id)
# # #         except Asset.DoesNotExist:
# # #             return Response({"message": "Asset not found."}, status=status.HTTP_404_NOT_FOUND)

# # #         # Update custodian field of the asset
# # #         asset.custodian_id = employee_id
# # #         asset.save()

# # #         serializer = AssignAssestSerializer(asset)
# # #         return Response(serializer.data)
