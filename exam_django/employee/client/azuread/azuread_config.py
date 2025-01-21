from utils.decouple_config_util import DecoupleConfigUtil


config = DecoupleConfigUtil.get_env_config()

AZUREAD_TENANT_ID = config("AZUREAD_TENANT_ID")
CLIENT_ID = config("SOCIAL_AUTH_AZUREAD_OAUTH2_KEY")
CLIENT_SECRET = config("SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET")
