from rest_framework import status
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_ASSIGNING_PENDING,
    CANNOT_REQUEST_ASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
)


class AssetSysadminRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, requester):
        if asset.assign_status == "ASSIGN_PENDING":
            raise NotAcceptableOperationException(
                {},
                CANNOT_REQUEST_ASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
                status.HTTP_406_NOT_ACCEPTABLE,
            )
        elif asset.assign_status == "REJECTED":
            email_subject = "REQUEST: ASSET ALLOCATION RE-REQUEST"
        else:
            email_subject = "REQUEST: ASSET ALLOCATION REQUEST"
        asset.assign_status = "ASSIGN_PENDING"
        asset.custodian = employee
        asset.requester = requester
        message = ASSET_ASSIGNING_PENDING
        return asset, message, email_subject
