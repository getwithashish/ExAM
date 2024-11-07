from abc import ABC, abstractmethod


class SSOUserDetailsServiceAbstract(ABC):

    @abstractmethod
    def get_sso_user_details(self, user):
        pass
