from django.db import models


class Memory(models.Model):

    memory_space = models.IntegerField(default=0, null=False, blank=False, unique=True)

    def __str__(self):
        return str(self.memory_space)
