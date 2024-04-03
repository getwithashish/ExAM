class AssetSysadminRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, requester):
        asset.assign_status = "ASSIGN_PENDING"
        asset.custodian = employee
        asset.requester = requester
        asset.save()
        return "ASSET ASSIGNMENT REQUEST SENT"
