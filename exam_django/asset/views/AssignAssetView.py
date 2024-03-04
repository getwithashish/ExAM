from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from asset.models import Asset, Employee
from rest_framework.permissions import IsAuthenticated


class AssignAssetView(APIView):
     
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        asset_id = request.data.get("asset_uuid")
        employee_name = request.data.get("employee_name")
        try:
            employee = Employee.objects.get(employee_name=employee_name)
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

        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND
            )
