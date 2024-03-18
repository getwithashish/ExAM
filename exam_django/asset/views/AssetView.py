from rest_framework.generics import ListCreateAPIView
from rest_framework import status
from asset.serializers import AssetReadSerializer, AssetWriteSerializer
from asset.models import Asset
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction
from asset.models import AssetLog
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
import json
from django.db.models import Q
from response import APIResponse
from messages import (
    ASSET_CREATE_PENDING_SUCCESSFUL,
    ASSET_CREATED_UNSUCCESSFUL,
    ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
    ASSET_LIST_SUCCESSFULLY_RETRIEVED,
    ASSET_SUCCESSFULLY_CREATED,
    USER_UNAUTHORIZED,
)


class AssetView(ListCreateAPIView):

    pagination_class = LimitOffsetPagination
    permission_classes = (IsAuthenticated,)
    serializer_class = AssetWriteSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return AssetReadSerializer  # For read operation
        return self.serializer_class

    def post(self, request):
        serializer = AssetWriteSerializer(data=request.data)

        if serializer.is_valid():
            user_scope = request.user.user_scope

            if user_scope == "SYSTEM_ADMIN":
                serializer.validated_data["asset_detail_status"] = "CREATE_PENDING"
                message = ASSET_CREATE_PENDING_SUCCESSFUL

            elif user_scope == "LEAD":
                serializer.validated_data["approved_by"] = request.user
                serializer.validated_data["asset_detail_status"] = "CREATED"
                message = ASSET_SUCCESSFULLY_CREATED

            else:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            serializer.validated_data["requester"] = request.user
            serializer.save()
            return APIResponse(
                data=serializer.data,
                message=message,
                status=status.HTTP_201_CREATED,
            )
        return APIResponse(
            data=serializer.errors,
            message=ASSET_CREATED_UNSUCCESSFUL,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def list(self, request, *args, **kwargs):
        try:
            queryset = Asset.objects.all()

            # Get query parameters
            assign_status = request.query_params.get("assign_status")
            asset_detail_status = request.query_params.get("asset_detail_status")

            limit = request.query_params.get("limit")
            offset = request.query_params.get("offset")

            query_params = request.query_params
            query_params_to_exclude = [
                "limit",
                "offset",
                "assign_status",
                "asset_detail_status",
            ]
            required_query_params = self.remove_fields_from_dict(
                query_params, query_params_to_exclude
            )

            if limit:
                self.pagination_class.default_limit = limit
            if offset:
                self.pagination_class.default_offset = offset

            if asset_detail_status:
                statuses = asset_detail_status.split("|")
                queryset = queryset.filter(asset_detail_status__in=statuses)

            if assign_status:
                statuses = assign_status.split("|")
                queryset = queryset.filter(assign_status__in=statuses)

            filter_kwargs = {}
            for field, value in required_query_params.items():
                filter_kwargs[f"{field}__icontains"] = value

            queryset = queryset.filter(**filter_kwargs)

            # Apply pagination
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = AssetReadSerializer(page, many=True)
                paginated_data = self.get_paginated_response(serializer.data)
                return APIResponse(
                    data=paginated_data.data,
                    message=ASSET_LIST_SUCCESSFULLY_RETRIEVED,
                    status=status.HTTP_200_OK,
                )

            serializer = AssetReadSerializer(queryset, many=True)  # Moved assignment here
            return APIResponse(
                data=serializer.data,
                message=ASSET_LIST_SUCCESSFULLY_RETRIEVED,
                status=status.HTTP_200_OK,
            )
        except Exception:
            return APIResponse(
                data={},  # Fixed missing serializer reference here
                message=ASSET_LIST_RETRIEVAL_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )

    def remove_fields_from_dict(self, input_dict, fields_to_remove):
        return {
            key: value
            for key, value in input_dict.items()
            if key not in fields_to_remove
        }


@receiver(pre_save, sender=Asset)
def log_asset_changes(sender, instance, **kwargs):
    old_instance = Asset.objects.filter(pk=instance.pk).values().first()
    if (
        old_instance
        or instance.asset_detail_status == "UPDATED"
        or instance.asset_detail_status == "ASSIGNED"
        or instance.asset_detail_status == "UNASSIGNED"
    ):
        changes = {
            field: getattr(instance, field)
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
