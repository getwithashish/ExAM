from django.db import models
import uuid


class Memory(models.Model):
    memory_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memory_space = models.IntegerField(default=0, null=False, blank=False
    )

    def __str__(self):
        return str(self.memory_space)
