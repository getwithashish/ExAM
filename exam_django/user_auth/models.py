import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class UserScope:
    USER_SCOPES = [
        ("MANAGER", "MANAGER"),
        ("SENIOR_LEAD", "SENIOR_LEAD"),
        ("LEAD", "LEAD"),
    ]


class User(AbstractUser):
    # user_uuid = models.UUIDField(
    #     primary_key=True, default=uuid.uuid4, editable=False, unique=True
    # )
    email = models.EmailField(
        max_length=100,
        null=False,
        blank=False,
        unique=True,
        verbose_name="email address",
    )
    mobile = models.CharField(max_length=12, null=True, blank=False, unique=True)
    user_scope = models.CharField(
        max_length=20, null=False, blank=False, choices=UserScope.USER_SCOPES
    )
    status = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    groups = models.ManyToManyField(
        Group, blank=True, related_name="custom_users_groups"
    )
    user_permissions = models.ManyToManyField(
        Permission, blank=True, related_name="custom_users_permissions"
    )

    def __str__(self):
        return str(self.username)
