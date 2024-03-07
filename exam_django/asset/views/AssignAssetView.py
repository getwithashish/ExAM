from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from asset.models import Asset, Employee
from asset.serializers import AssignAssetSerializer

from response import APIResponse
from messages import (
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_NOT_FOUND ,
    EMPLOYEE_NOT_FOUND_ERROR,
    GLOBAL_500_EXCEPTION_ERROR
)

class AssignAssetView(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        serializer = AssignAssetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["request_type"] = "ASSIGN"
            asset_id = request.data.get("asset_uuid")
            employee_id = request.data.get("id")

            try:
                employee = Employee.objects.get(id=employee_id)
                asset = Asset.objects.get(asset_uuid=asset_id)
                asset.custodian = employee
                asset.approval_status = "Pending"
                requester = request.user
                serializer.validated_data["requester"] = requester
                asset.save()
                return APIResponse(
                data=serializer.data,
                message=ASSET_SUCCESSFULLY_ASSIGNED,
                status=status.HTTP_201_CREATED,
            )
            except Asset.DoesNotExist:
                return APIResponse(
                message=ASSET_NOT_FOUND ,
                status=status.HTTP_404_NOT_FOUND,
            )

            except Employee.DoesNotExist:
                return APIResponse(
                message=EMPLOYEE_NOT_FOUND_ERROR ,
                status=status.HTTP_404_NOT_FOUND,
            )
               
        else:
             return APIResponse(
                message=GLOBAL_500_EXCEPTION_ERROR,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

