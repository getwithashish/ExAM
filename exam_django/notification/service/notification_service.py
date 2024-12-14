from enum import Enum

from django.conf import settings

from asset.models.asset import Asset
from utils.celery_status_checker import CeleryStatusChecker
from notification.models import Notification, email_status_choices
from messages import (
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    EMPLOYEE_ASSIGNED_SUCESSFULLY,
    EMPLOYEE_UNASSIGNED_SUCESSFULLY,
)
from notification.service.email_handler import EmailHandler


global_config = settings.GLOBAL_CONFIG


def default_email_status() -> str:
    enabled_notification_medium = global_config["notification"]["enabled_medium"]
    if "EMAIL" in enabled_notification_medium:
        return email_status_choices[0][1]
    return email_status_choices[1][1]


class NotificationService:

    def __init__(self):
        self.configured_notification_methods = global_config["notification"][
            "enabled_medium"
        ]

    def send_notification(
        self, subject: str, message: str, is_part_of_request_flow: bool = True, **kwargs
    ) -> bool:
        asset = Asset.objects.get(asset_uuid=kwargs["asset_uuid"])
        notification = Notification(
            asset_uuid=asset, email_status=default_email_status()
        )
        notification.save()

        if CeleryStatusChecker.check_celery_status():
            for notification_method in self.configured_notification_methods:
                notification_method_class = NotificationMethod[
                    notification_method
                ].value
                notification_method_class().send_notification.delay(
                    notification_id=notification.id,
                    subject=subject,
                    message=message,
                    is_part_of_request_flow=is_part_of_request_flow,
                    **kwargs
                )

            if message == ASSET_SUCCESSFULLY_ASSIGNED:
                message = EMPLOYEE_ASSIGNED_SUCESSFULLY
                email_subject = "ASSET ALLOCATED"
                self.send_notification(subject=email_subject, message=message, **kwargs)

            elif message == ASSET_SUCCESSFULLY_UNASSIGNED:
                message = EMPLOYEE_UNASSIGNED_SUCESSFULLY
                email_subject = "ASSET DE-ALLOCATED"
                self.send_notification(subject=email_subject, message=message, **kwargs)

            return True

        return False


class NotificationMethod(Enum):

    EMAIL = EmailHandler
