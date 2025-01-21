from django.db import models


class EmployeeSyncHistory(models.Model):
    remote_source = models.CharField(max_length=20, null=False, blank=False)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True)
    # For Azure AD, store the deltaLink in this field
    additional_data = models.TextField(null=True, blank=False)

    class Meta:
        ordering = ["-started_at"]
