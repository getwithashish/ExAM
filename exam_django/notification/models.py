from django.db import models


email_status_choices = (
    ("EMAIL_NOT_CONFIGURED", "EMAIL_NOT_CONFIGURED"),
    ("EMAIL_NOT_SENT", "EMAIL_NOT_SENT"),
    ("EMAIL_SENDING", "EMAIL_SENDING"),
    ("EMAIL_SENT", "EMAIL_SENT"),
    ("EMAIL_SENDING_FAILED", "EMAIL_SENDING_FAILED"),
)


class Notification(models.Model):
    asset_uuid = models.ForeignKey(
        "asset.Asset", on_delete=models.CASCADE, null=True, blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    email_status = models.CharField(
        max_length=30,
        default="EMAIL_NOT_CONFIGURED",
        choices=email_status_choices,
        null=False,
        blank=False,
    )


class EmailNotification(models.Model):
    notification_id = models.ForeignKey("Notification", on_delete=models.CASCADE, null=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    message_id = models.CharField(max_length=255, blank=False)
