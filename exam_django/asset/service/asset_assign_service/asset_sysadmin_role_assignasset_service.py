from messages import ASSET_ASSIGNING_PENDING


class AssetSysadminRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, requester):
        asset.assign_status = "ASSIGN_PENDING"
        asset.custodian = employee
        asset.requester = requester
        message = ASSET_ASSIGNING_PENDING
        email_subject = "ASSET ASSIGNMENT REQUEST"
        return asset, message, email_subject
