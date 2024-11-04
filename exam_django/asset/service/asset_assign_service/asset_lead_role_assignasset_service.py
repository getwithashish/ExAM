from messages import ASSET_SUCCESSFULLY_ASSIGNED


class AssetLeadRoleAssignService:
    @staticmethod
    def assign_asset(asset, employee, requester):
        asset.assign_status = "ASSIGNED"
        asset.status = "USE"
        asset.custodian = employee
        asset.requester = requester
        asset.save()
        return ASSET_SUCCESSFULLY_ASSIGNED
