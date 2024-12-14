from typing import Dict
import tomlkit


class GlobalConfig:

    @staticmethod
    def get_configuration() -> Dict:
        with open("config.toml", mode="rt", encoding="utf-8") as fp:
            config = tomlkit.load(fp)

        with open("notification_config.toml", mode="rt", encoding="utf-8") as fp:
            email_config = tomlkit.load(fp)

        merged_config = config.copy()
        merged_config.update(email_config)

        return merged_config
