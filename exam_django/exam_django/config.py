from typing import Dict
import tomlkit


class GlobalConfig:

    @staticmethod
    def get_configuration() -> Dict:
        with open("config.toml", mode="rt", encoding="utf-8") as fp:
            config = tomlkit.load(fp)
        return config
