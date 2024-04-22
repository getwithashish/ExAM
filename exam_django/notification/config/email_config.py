from utils.decouple_config_util import DecoupleConfigUtil


config = DecoupleConfigUtil.get_env_config()

FROM_EMAIL = config("EMAIL_HOST_USER")
