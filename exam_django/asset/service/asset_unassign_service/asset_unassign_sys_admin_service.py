from messages import ASSET_UNASSIGNING_PENDING


class AssetSysadminRoleUnassignService:
    @staticmethod
    def unassign_asset(asset, requester):
        asset.assign_status = "ASSIGN_PENDING"
        asset.custodian = None
        asset.requester = requester
        message = ASSET_UNASSIGNING_PENDING
        email_subject = "ASSET DEALLOCATION REQUEST SENT"
        return asset, message, email_subject
