from rest_framework import status

from asset.models.asset import Asset
from asset.models.business_unit import BusinessUnit
from employee.models.employee import Employee
from user_auth.models import User
from exceptions import NotAcceptableOperationException
from messages import (
    ASSET_ASSIGNING_PENDING,
    CANNOT_REQUEST_ASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING,
)


class AssetSysadminRoleAssignService:
    """
    Service class for system admin to assign an asset to a custodian
    """

    @staticmethod
    def assign_asset(asset: Asset, employee: Employee, business_unit: BusinessUnit, requester: User) -> tuple:
        """
        Assigns an asset to a specified employee and business unit.

        Parameters:
        asset (Asset): The asset to be assigned.
        employee (Employee): The employee to whom the asset is assigned.
        business_unit (BusinessUnit): The business unit involved in the assignment.
        requester (User): The individual requesting the assignment.

        Returns:
        tuple: A tuple containing the updated asset, a message, and the email subject.
        """
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
        asset.business_unit = business_unit
        asset.requester = requester
        message = ASSET_ASSIGNING_PENDING
        return asset, message, email_subject
