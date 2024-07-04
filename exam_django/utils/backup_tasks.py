import os
from datetime import datetime
from django.core import management
from celery import shared_task
from django.conf import settings
import sentry_sdk

from utils.decouple_config_util import DecoupleConfigUtil


config = DecoupleConfigUtil.get_env_config()


@shared_task
def perform_full_backup():
    try:
        BACKUP_FILE = generate_backup_file_path()

        with open(BACKUP_FILE, "w") as backup_file:
            management.call_command("dumpdata", "--format=json", stdout=backup_file)
    except Exception as e:
        sentry_sdk.capture_exception(e)


def generate_backup_file_path():
    DB_NAME = config("DB_NAME")
    BACKUP_PARENT_DIR = config("BACKUP_PARENT_DIR")
    FULL_BACKUP_DIR = config("FULL_BACKUP_DIR")
    PROJECT_DIR = settings.BASE_DIR
    BACKUP_DIR_PATH = os.path.join(PROJECT_DIR, BACKUP_PARENT_DIR, FULL_BACKUP_DIR)
    if not os.path.exists(BACKUP_DIR_PATH):
        os.makedirs(BACKUP_DIR_PATH)
    DATE = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    BACKUP_FILE = f"{BACKUP_DIR_PATH}/{DB_NAME}_{DATE}_full.json"
    return BACKUP_FILE
