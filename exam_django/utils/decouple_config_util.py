import os
import decouple
from decouple import RepositoryEnv
import pathlib


class DecoupleConfigUtil:

    @classmethod
    def get_env_config(cls) -> decouple.Config:
        """
        Creates and returns a Config object based on the environment setting.
        It uses .env for development and .prod.env for production.
        """

        ENVIRONMENT = os.getenv("ENVIRONMENT", default="DEVELOPMENT")

        env_files = {
            "DEVELOPMENT": ".env",
            "PRODUCTION": ".prod.env",
        }

        app_dir_path = pathlib.Path(__file__).resolve().parent.parent
        env_file_name = env_files.get(ENVIRONMENT, ".env")
        file_path = app_dir_path / env_file_name

        if not file_path.is_file():
            raise FileNotFoundError(f"Environment file not found: {file_path}")

        return decouple.Config(RepositoryEnv(file_path))
