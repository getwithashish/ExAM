from django.db import models
import uuid
from user_auth.models import User


asset_category_choices = (("HARDWARE", "HARDWARE"), ("SOFTWARE", "SOFTWARE"))

# status_choices = (
#     ("IN USE", "IN USE"),
#     ("IN STORE", "IN STORE"),
#     ("IN REPAIR", "IN REPAIR"),
#     ("OUTDATED", "OUTDATED"),
#     ("DISPOSED", "DISPOSED"),
#     ("DAMAGED", "DAMAGED"),
#     ("UNREPAIRABLE", "UNREPAIRABLE"),
# )

status_choices = (
    ("STOCK", "STOCK"),
    ("USE", "USE"),
    ("DAMAGED", "DAMAGED"),
    ("REPAIR", "REPAIR"),
    ("OUTDATED", "OUTDATED"),
    ("SCRAP", "SCRAP"),
)
# STOCK - Assets which are currently in stock, which are not being used
# ALLOCATED(USE) - Assets which are currently being used (includes both assets allocated to custodians and also used by SFM)
# ACTIVE - STOCK + USE

# DAMAGED - Assets which are damaged, which needs to be repaired or thrown to scrap
# REPAIR - Assets which are currently being repaired
# OUTDATED - Assets which are not currently being used, but still working
# INACTIVE - DAMAGED + REPAIR + OUTDATED

# SCRAP - Assets which are not used anymore, and thrown out

asset_detail_status = (
    ("CREATE_PENDING", "CREATE_PENDING"),
    ("UPDATE_PENDING", "UPDATE_PENDING"),
    ("CREATED", "CREATED"),
    ("UPDATED", "UPDATED"),
    ("CREATE_REJECTED", "CREATE_REJECTED"),
    ("UPDATE_REJECTED", "UPDATE_REJECTED"),
)

assign_status = (
    ("UNASSIGNED", "UNASSIGNED"),
    ("ASSIGN_PENDING", "ASSIGN_PENDING"),
    ("ASSIGNED", "ASSIGNED"),
    ("REJECTED", "REJECTED"),
)


class Asset(models.Model):
    asset_uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True
    )
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
    owner = models.CharField(max_length=50, default="EXPERION", null=False)
    custodian = models.ForeignKey(
        "Employee",
        related_name="%(app_label)s_%(class)s_custodian",
        on_delete=models.CASCADE,
        null=True,
    )
    date_of_purchase = models.DateField(null=False)
    status = models.CharField(
        max_length=50,
        default="STOCK",
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
        "BusinessUnit", on_delete=models.CASCADE, null=True, blank=False
    )
    os = models.CharField(max_length=50, null=True, blank=False)
    os_version = models.CharField(max_length=50, null=True, blank=False)
    mobile_os = models.CharField(max_length=50, null=True, blank=False)
    processor = models.CharField(max_length=50, null=True, blank=False)
    processor_gen = models.CharField(max_length=50, null=True, blank=False)
    memory = models.ForeignKey("Memory", on_delete=models.CASCADE, null=True)
    storage = models.CharField(max_length=50, null=True, blank=False)
    configuration = models.CharField(max_length=255, null=True, blank=False)
    accessories = models.TextField(max_length=255, null=True, blank=False)
    notes = models.TextField(null=True)
    license_type = models.CharField(max_length=50, null=True, blank=False)
    approved_by = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_conceder",
        on_delete=models.CASCADE,
        null=True,
        blank=False,
    )
    asset_detail_status = models.CharField(
        max_length=50,
        default="CREATE_PENDING",
        choices=asset_detail_status,
        null=False,
        blank=False,
    )
    assign_status = models.CharField(
        max_length=50,
        default="UNASSIGNED",
        choices=assign_status,
        null=False,
        blank=False,
    )
    approval_status_message = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    requester = models.ForeignKey(
        User,
        related_name="%(app_label)s_%(class)s_requester",
        on_delete=models.CASCADE,
        null=True,
        blank=False,
    )

    is_deleted = models.BooleanField(default=False, null=False, blank=False)

    def __str__(self):
        return str(self.product_name)
