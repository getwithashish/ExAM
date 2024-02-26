from django.db import models
import uuid

asset_category_choices = (("HARDWARE", "HARDWARE"), ("SOFTWARE", "SOFTWARE"))

owner_choices = (("EXPERION", "EXPERION"),)

status_choices = (
    ("IN USE", "IN USE"),
    ("IN STORE", "IN STORE"),
    ("IN REPAIR", "IN REPAIR"),
    ("EXPIRED", "EXPIRED"),
    ("DISPOSED", "DISPOSED"),
)

os_choices = (
    ("WINDOWS", "WINDOWS"),
    ("LINUX", "LINUX"),
    ("MAC", "MAC"),
)

approval_status_choices = (
    ("PENDING", "PENDING"),
    ("APPROVED", "APPROVED"),
    ("REJECTED", "REJECTED"),
    ("CANCELLED", "CANCELLED"),
)


class Asset(models.Model):
    asset_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True
    )
    asset_id = models.CharField(max_length=255, null=True, blank=False)
    version = models.IntegerField(default=0)
    asset_category = models.CharField(max_length=50, choices=asset_category_choices)
    asset_type = models.ForeignKey(
        "AssetType",
        on_delete=models.CASCADE
    )
    product_name = models.CharField(max_length=255, null=False)
    model_number = models.CharField(
        max_length=255, null=True, blank=False, default=None
    )
    serial_number = models.IntegerField(null=True, blank=False, default=None)
    owner = models.CharField(max_length=50, choices=owner_choices)
    custodian = models.ForeignKey(
        "Employee",
        related_name="assets_custodian",
        on_delete=models.CASCADE
    )
    date_of_purchase = models.DateField(null=False)
    status = models.CharField(max_length=50, default="IN STORE", choices=status_choices)
    warranty_period = models.IntegerField(null=False)
    location = models.ForeignKey(
        "Location", related_name="assets_location", on_delete=models.CASCADE
    )
    invoice_location = models.ForeignKey(
        "Location", related_name="assets_invoice_location", on_delete=models.CASCADE
    )
    business_unit = models.ForeignKey(
        "BusinessUnit",
        on_delete=models.CASCADE,
        null=False,
    )
    os = models.CharField(max_length=50, null=True, blank=True, choices=os_choices)
    os_version = models.CharField(max_length=50)
    mobile_os = models.CharField(max_length=100, null=True, blank=True)
    processor = models.CharField(max_length=100, null=True, blank=True)
    processor_gen = models.CharField(max_length=100, null=True, blank=True)
    memory = models.CharField(max_length=50, null=True, blank=True)
    storage = models.CharField(max_length=50, null=True, blank=True)
    configuration = models.TextField()
    accessories = models.CharField(max_length=50, null=True, blank=True)
    notes = models.CharField(max_length=255)
    conceder = models.ForeignKey("User", on_delete=models.CASCADE)
    approval_status = models.CharField(
        max_length=50, default="PENDING", choices=approval_status_choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
