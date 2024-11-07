from typing import List
import jwt

from user_auth.service.sso_service.user_details_service.sso_user_details_service_abstract import (
    SSOUserDetailsServiceAbstract,
)


class MicrosoftSSOUserDetailsService(SSOUserDetailsServiceAbstract):

    def get_sso_user_details(self, user):
        user_scope = self.get_user_scope_from_jwt_token(user)
        return (user_scope,)

    def get_user_scope_from_jwt_token(self, user) -> List[str]:
        payload = jwt.decode(
            user.social_user.extra_data["id_token"],
            options={"verify_signature": False},
            algorithms=["RS256"],
        )
        user_scopes = payload["roles"]
        return user_scopes
