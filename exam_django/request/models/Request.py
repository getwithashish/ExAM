from django.db import models
import uuid
from asset.models import Asset, User

request_choices = (
    ("ASSET CREATION", "Asset Creation"),
    ("ASSET ASSIGNMENT", "Asset Assignment"),
    ("ASSET STATUS UPDATE", "Asset Status Update"),
)

request_status_choices = (
    ("APPROVED", "Approved"),
    ("REJECTED", "Rejected"),
    ("DELETE", "Delete"), 
)


class Request(models.Model):
    request_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    requester = models.ForeignKey(
        User, related_name="requested_user", on_delete=models.CASCADE
    )
    request_type = models.CharField(
        max_length=50, default=None, choices=request_choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    conceder = models.ForeignKey(
        User, related_name="conceder_user", on_delete=models.CASCADE
    )
    request_description = models.TextField(blank=True, null=True)
    reject_description = models.TextField(blank=True, null=True)
    request_status = models.CharField(
        max_length=50, default="Pending", choices=request_status_choices
    )

    def __str__(self):
        return str(self.request_type)



