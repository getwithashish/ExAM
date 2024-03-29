from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from rest_framework.views import APIView
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from asset.models import Asset, Memory, BusinessUnit, AssetType
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
import json
from asset.service.asset_crud_service.asset_mutation_service import AssetMutationService
from asset.service.asset_crud_service.asset_lead_role_mutation_service import (
    AssetLeadRoleMutationService,
)
from asset.service.asset_crud_service.asset_sysadmin_role_mutation_service import (
    AssetSysadminRoleMutationService,
)
from asset.service.asset_crud_service.asset_query_service import AssetQueryService
from response import APIResponse
from messages import (
    ASSET_CREATED_UNSUCCESSFUL,
    ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
    USER_UNAUTHORIZED,
)


class AssetView(ListCreateAPIView):

    pagination_class = LimitOffsetPagination
    permission_classes = (IsAuthenticated,)
    serializer_class = AssetWriteSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AssetReadSerializer  # For read operation
        return self.serializer_class

    def post(self, request):
        serializer = AssetWriteSerializer(data=request.data)

        if serializer.is_valid():
            user_scope = request.user.user_scope

            if user_scope == "SYSTEM_ADMIN":
                asset_sysadmin_role_mutation_service = (
                    AssetSysadminRoleMutationService()
                )
                asset_mutation_service = AssetMutationService(
                    asset_sysadmin_role_mutation_service
                )

            elif user_scope == "LEAD":
                asset_lead_role_mutation_service = AssetLeadRoleMutationService()
                asset_mutation_service = AssetMutationService(
                    asset_lead_role_mutation_service
                )

            else:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
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

    def list(self, request, *args, **kwargs):
        try:
            asset_query_service = AssetQueryService()
            return asset_query_service.get_asset_details(request)

        except Exception as e:
            print("Error: ", e)
            return APIResponse(
                data={},  # Fixed missing serializer reference here
                message=ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )

    def remove_fields_from_dict(self, input_dict, fields_to_remove):
        return {
            key: value
            for key, value in input_dict.items()
            if key not in fields_to_remove
        }


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
