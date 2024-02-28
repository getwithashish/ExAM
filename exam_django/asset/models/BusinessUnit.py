from django.db import models


class BusinessUnit(models.Model):

    business_unit_name = models.CharField(max_length=255, null=False,
                                          blank=False)

    def __str__(self):
        return str(self.business_unit_name)
