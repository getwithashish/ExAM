from abc import ABC, abstractmethod


class AssetUserRoleApproveAbstract(ABC):

    @abstractmethod
    def approve_request(self, asset, request):
        pass

    @abstractmethod
    def reject_request(self, asset, request):
        pass
