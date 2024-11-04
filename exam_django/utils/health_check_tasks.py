from celery import shared_task
import sentry_sdk
import requests

from messages import (
    HEALTH_CHECK_APPLICATION_FAILED,
    HEALTH_CHECK_EXTERNAL_SERVICE_FAILED,
)
from utils.decouple_config_util import DecoupleConfigUtil


config = DecoupleConfigUtil.get_env_config()


@shared_task
def check_application_health():
    try:
        response = requests.get(f"{config('HEALTH_CHECK_APP')}?format=json")
        response.raise_for_status()
        health_status = response.json()
        if not are_all_status_working(health_status.values()):
            sentry_sdk.capture_message(
                HEALTH_CHECK_APPLICATION_FAILED.format(health_status), level="error"
            )
    except Exception as e:
        sentry_sdk.capture_exception(e)


@shared_task
def check_external_service_health():
    try:
        response = requests.get(f"{config('HEALTH_CHECK_EXTERNAL')}?format=json")
        response.raise_for_status()
        health_status = response.json()
        if not are_all_status_working(health_status.values()):
            sentry_sdk.capture_message(
                HEALTH_CHECK_EXTERNAL_SERVICE_FAILED.format(health_status),
                level="error",
            )
    except Exception as e:
        sentry_sdk.capture_exception(e)


def are_all_status_working(status_list):
    for status in status_list:
        if status != "working":
            return False
    return True
