from abc import ABC, abstractmethod


class AssetUserRoleApproveAbstract(ABC):
    """
    An abstract base class to define the blueprint for asset request approvals and rejections.
    """

    @abstractmethod
    def approve_request(self, asset, request):
        pass

    @abstractmethod
    def reject_request(self, asset, request):
        pass
