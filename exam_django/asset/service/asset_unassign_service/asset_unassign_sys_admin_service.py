from rest_framework import status
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_UNASSIGNING_PENDING,
    CANNOT_REQUEST_UNASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
)


class AssetSysadminRoleUnassignService:
    @staticmethod
    def unassign_asset(asset, requester):
        if asset.assign_status == "ASSIGN_PENDING":
            raise NotAcceptableOperationException(
                {},
                CANNOT_REQUEST_UNASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
                status.HTTP_406_NOT_ACCEPTABLE,
            )
        elif asset.assign_status == "REJECTED":
            email_subject = "REQUEST: ASSET DEALLOCATION RE-REQUEST"
        else:
            email_subject = "REQUEST: ASSET DEALLOCATION REQUEST"
        asset.assign_status = "ASSIGN_PENDING"
        asset.custodian = None
        asset.requester = requester
        message = ASSET_UNASSIGNING_PENDING
        
        return asset, message, email_subject
