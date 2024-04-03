from messages import ASSET_SUCCESSFULLY_UNASSIGNED


class AssetLeadRoleUnassignService:
    @staticmethod
    def unassign_asset(asset, requester):
        asset.assign_status = "UNASSIGNED"
        asset.status = "IN STORE"
        asset.custodian = None
        asset.requester = requester
        message = ASSET_SUCCESSFULLY_UNASSIGNED
        email_subject = "ASSET DEALLOCATION SUCCESSFUL"
        return asset, message, email_subject
