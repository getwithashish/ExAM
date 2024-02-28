from django.db import models
import uuid

# from models import Asset

request_choices = (
    ("ASSET CREATION", "Asset Creation"),
    ("ASSET ASSIGNMENT", "Asset Assignment"),
    ("ASSET STATUS UPDATE", "Asset Status Update"),
)

request_status_choices = (
    ("APPROVED", "Approved"),
    ("REJECTED", "Rejected"),
    ("Deleted", "Deleted"),
)


class Request(models.Model):
    request_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    asset_id = models.ForeignKey("Asset", on_delete=models.CASCADE)
    requester_id = models.ForeignKey("User", on_delete=models.CASCADE)
    request_type = models.CharField(
        max_length=50, default=None, choices=request_choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    conceder_id = models.ForeignKey("Conceder", on_delete=models.CASCADE)
    request_description = models.TextField()
    reject_description = models.TextField()
    request_status = models.CharField(
        max_length=50, default="Pending", choices=request_status_choices
    )
