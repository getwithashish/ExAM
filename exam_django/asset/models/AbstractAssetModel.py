from django.db import models


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


class AbstractAssetModel(models.Model):

    asset_id = models.CharField(max_length=255, null=True, blank=False)
    version = models.IntegerField(default=0)
    asset_category = models.CharField(max_length=50, choices=asset_category_choices)
    asset_type = models.ForeignKey("AssetType", on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255, null=False)
    model_number = models.CharField(
        max_length=255, null=True, blank=False, default=None
    )
    serial_number = models.CharField(
        max_length=255, null=True, blank=False, default=None
    )
    owner = models.CharField(max_length=50, choices=owner_choices, null=False)
    custodian = models.ForeignKey(
        "Employee", related_name="%(app_label)s_%(class)s_custodian", on_delete=models.CASCADE, null=True
    )
    date_of_purchase = models.DateField(null=False)
    status = models.CharField(
        max_length=50,
        default="IN STORE",
        choices=status_choices,
        null=False,
        blank=False,
    )
    warranty_period = models.IntegerField(null=True, blank=False)
    location = models.ForeignKey(
        "Location",
        related_name="%(app_label)s_%(class)s_location",
        on_delete=models.CASCADE,
        null=True,
        blank=False,
    )
    invoice_location = models.ForeignKey(
        "Location",
        related_name="%(app_label)s_%(class)s_invoice_location",
        on_delete=models.CASCADE,
        null=True,
        blank=False,
    )
    business_unit = models.ForeignKey(
        "BusinessUnit",
        on_delete=models.CASCADE,
        null=False,
    )
    os = models.CharField(max_length=50, null=True, blank=False, choices=os_choices)
    os_version = models.CharField(max_length=50, null=True, blank=False)
    mobile_os = models.CharField(max_length=100, null=True, blank=False)
    processor = models.CharField(max_length=100, null=True, blank=False)
    processor_gen = models.CharField(max_length=100, null=True, blank=False)
    memory = models.ForeignKey("Memory", on_delete=models.CASCADE, null=True)
    storage = models.CharField(max_length=50, null=True, blank=False)
    configuration = models.TextField(null=True, blank=False)
    accessories = models.CharField(max_length=50, null=True, blank=False)
    notes = models.CharField(max_length=255)
    conceder = models.ForeignKey(
        "User", on_delete=models.CASCADE, null=True, blank=False
    )
    approval_status = models.CharField(
        max_length=50,
        default="PENDING",
        choices=approval_status_choices,
        null=False,
        blank=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
