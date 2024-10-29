import json
from django.db import models


class Memory(models.Model):

    memory_space = models.IntegerField(default=0, null=False, blank=False, unique=True)

    def __str__(self):
        return json.dumps({"id": self.id, "memory_space": self.memory_space})
