class AssetLeadRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, requester):
        asset.assign_status = "ASSIGNED"
        asset.status = "IN USE"
        asset.custodian = employee
        asset.requester = requester
        asset.save()
        return "ASSET ASSIGNMENT SUCCESSFUL"
    