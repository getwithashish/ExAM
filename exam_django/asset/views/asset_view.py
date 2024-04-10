from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from asset.models import Asset, Memory, BusinessUnit, AssetType
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
from asset.service.asset_crud_service.asset_mutation_service import AssetMutationService
from asset.service.asset_crud_service.asset_lead_role_mutation_service import (
    AssetLeadRoleMutationService,
)
from asset.service.asset_crud_service.asset_sysadmin_role_mutation_service import (
    AssetSysadminRoleMutationService,
)
from asset.service.asset_crud_service.asset_normal_query_service import (
    AssetNormalQueryService,
)
from asset.service.asset_crud_service.asset_advanced_query_service_with_json_logic import (
    AssetAdvancedQueryServiceWithJsonLogic,
)
from exceptions import NotAcceptableOperationException, PermissionDeniedException
from response import APIResponse
from messages import (
    ASSET_CREATED_UNSUCCESSFUL,
    ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
    ASSET_NOT_FOUND,
    USER_UNAUTHORIZED,
    ASSET_DELETION_UNSUCCESSFUL
)


class AssetView(APIView):

    permission_classes = (IsAuthenticated,)
    serializer_class = AssetWriteSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AssetReadSerializer
        return self.serializer_class

    def get(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class

            if request.query_params.get("json_logic"):
                asset_query_service = AssetAdvancedQueryServiceWithJsonLogic()
            else:
                asset_query_service = AssetNormalQueryService()

            data, message, http_status = asset_query_service.get_asset_details(
                serializer, request
            )
            return APIResponse(
                data=data,
                message=message,
                status=http_status,
            )

        except Exception as e:
            print("Error: ", e)
            return APIResponse(
                data={},
                message=ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user_scope = request.user.user_scope

            if user_scope == "SYSTEM_ADMIN":
                asset_user_role_mutation_service = AssetSysadminRoleMutationService()
            elif user_scope == "LEAD":
                asset_user_role_mutation_service = AssetLeadRoleMutationService()
            else:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            asset_mutation_service = AssetMutationService(
                asset_user_role_mutation_service
            )
            data, message, http_status = asset_mutation_service.create_asset(
                serializer, request
            )

            return APIResponse(
                data=data,
                message=message,
                status=http_status,
            )

        return APIResponse(
            data=serializer.errors,
            message=ASSET_CREATED_UNSUCCESSFUL,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def patch(self, request):
        try:
            user_scope = request.user.user_scope

            if user_scope == "SYSTEM_ADMIN":
                asset_user_role_mutation_service = AssetSysadminRoleMutationService()
            elif user_scope == "LEAD":
                asset_user_role_mutation_service = AssetLeadRoleMutationService()
            else:
                raise PermissionDeniedException(
                    {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
                )

            asset_mutation_service = AssetMutationService(
                asset_user_role_mutation_service
            )
            data, message, http_status = asset_mutation_service.update_asset(
                self.serializer_class, request
            )

            return APIResponse(
                data=data,
                message=message,
                status=http_status,
            )

        except PermissionDeniedException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except Asset.DoesNotExist:
            return APIResponse(
                data={},
                message=ASSET_NOT_FOUND,
                status=status.HTTP_404_NOT_FOUND,
            )

        except NotAcceptableOperationException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )
   
    def delete(self, request):
        asset_uuid = request.data.get("asset_uuid")
        try:
            asset = get_object_or_404(Asset, asset_uuid=asset_uuid)
            asset.is_deleted = True
            asset.save()
            return APIResponse(
                data={"asset_uuid": asset_uuid},
                message="Asset deleted successfully.",
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print("Error: ", e)
            return APIResponse(
                data={},
                message="Error occurred while deleting asset.",
                status=status.HTTP_400_BAD_REQUEST,
            )

class UserAgentAssetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request_body = json.loads(request.body)
        print(request_body)
        # memory = Memory.objects.filter(memory_space=request_body.get("TotalMemoryGB")).first()
        asset_type = AssetType.objects.filter(asset_type_name="Laptop").first()
        memory = int(request_body.get("totalMemoryGB"))
        memory, create = Memory.objects.get_or_create(memory_space=memory)
        business_unit, create = BusinessUnit.objects.get_or_create(
            business_unit_name="DU0"
        )

        Asset.objects.create(
            asset_category="HARDWARE",
            asset_type=asset_type,
            product_name=request_body.get("manufacturer"),
            model_number=request_body.get("productModel"),
            serial_number=request_body.get("serialNumber"),
            os=request_body.get("os"),
            os_version=request_body.get("osVersion"),
            processor=request_body.get("cpuModel"),
            memory=memory,
            storage=int(request_body.get("totalStorageGB")),
            owner="EXPERION",
            business_unit=business_unit,
            asset_detail_status="CREATED",
            assign_status="UNASSIGNED",
            date_of_purchase="2000-01-01",
        )

        return APIResponse(
            status=status.HTTP_200_OK, message="Successfully Created New Asset"
        )
