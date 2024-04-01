from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from asset.models import Asset
from asset.service.asset_approve_service.asset_approve_service import (
    AssetApproveService,
)
from asset.service.asset_approve_service.lead_role_service.asset_lead_role_approve_service import (
    AssetLeadRoleApproveService,
)
from exceptions import (
    NotAcceptableOperationException,
    NotFoundException,
    PermissionDeniedException,
)
from messages import (
    ASSET_NOT_FOUND,
    USER_UNAUTHORIZED,
)
from response import APIResponse


class AssetApproveView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        elif self.request.method == "DELETE":
            return [IsAuthenticated()]
        else:
            return super().get_permissions()

    def post(self, request):
        try:
            user_scope = request.user.user_scope
            if user_scope == "LEAD":
                asset_user_role_approve_service = AssetLeadRoleApproveService()
            else:
                raise PermissionDeniedException(
                    {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
                )

            asset_approve_service = AssetApproveService(asset_user_role_approve_service)
            data, message, http_status = asset_approve_service.approve_request(request)

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

        except NotFoundException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except NotAcceptableOperationException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

    def delete(self, request):
        try:
            user_scope = request.user.user_scope

            if user_scope == "LEAD":
                asset_user_role_approve_service = AssetLeadRoleApproveService()
            else:
                raise PermissionDeniedException(
                    {}, USER_UNAUTHORIZED, status.HTTP_401_UNAUTHORIZED
                )

            asset_approve_service = AssetApproveService(asset_user_role_approve_service)
            data, message, http_status = asset_approve_service.reject_request(request)

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

        except NotFoundException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except NotAcceptableOperationException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )
