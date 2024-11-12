from rest_framework import status
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_SUCCESSFULLY_ASSIGNED,
    CANNOT_REQUEST_ASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
)


class AssetLeadRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, business_unit, requester):
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
        asset.assign_status = "ASSIGNED"
        asset.status = "USE"
        asset.custodian = employee
        asset.business_unit = business_unit
        asset.requester = requester
        asset.save()
        return ASSET_SUCCESSFULLY_ASSIGNED
