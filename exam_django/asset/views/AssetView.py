from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetReadSerializer, AssetSerializer
from asset.models import Asset
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction
from asset.models import AssetLog
from rest_framework.pagination import LimitOffsetPagination
import json


class AssetView(ListCreateAPIView):

    pagination_class = LimitOffsetPagination

    def post(self, request, format=None):
        serializer = AssetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            queryset = Asset.objects.all()

            limit = request.query_params.get("limit")
            offset = request.query_params.get("offset")

            if limit:
                self.pagination_class.default_limit = limit
            if offset:
                self.pagination_class.default_offset = offset

            # Applying pagination
            page = self.paginate_queryset(queryset)

            # TODO Wrap in custom response format
            if page is not None:
                serializer = AssetReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = AssetReadSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


@receiver(pre_save, sender=Asset)
def log_asset_changes(sender, instance, **kwargs):
    old_instance = Asset.objects.filter(pk=instance.pk).values().first()
    if old_instance and instance.approval_status == "APPROVED":
        changes = {
            field: (old_instance[field], getattr(instance, field))
            for field in old_instance
            if field != "asset_uuid"
        }
        asset_log_data = json.dumps(changes, indent=4, sort_keys=True, default=str)

        if changes:
            with transaction.atomic():
                asset_instance = Asset.objects.select_for_update().get(pk=instance.pk)
                asset_log_entry = AssetLog.objects.create(
                    asset_uuid=asset_instance,
                    asset_log=asset_log_data,
                )
                asset_log_entry.save()
