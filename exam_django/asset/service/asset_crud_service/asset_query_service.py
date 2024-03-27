from asset.models import Asset
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from asset.serializers.AssetSerializer import AssetReadSerializer
from messages import ASSET_LIST_SUCCESSFULLY_RETRIEVED
from response import APIResponse


class AssetQueryService:

    def get_asset_details(self, serializer, request):
        self.pagination = LimitOffsetPagination()
        queryset = Asset.objects.all()

        global_search = request.query_params.get("global_search")

        if global_search:
            query = Q()
            for field in [
                "asset_uuid",
                "asset_id",
                "version",
                "asset_category",
                "product_name",
                "model_number",
                "serial_number",
                "owner",
                "date_of_purchase",
                "status",
                "warranty_period",
                "os",
                "os_version",
                "mobile_os",
                "processor",
                "processor_gen",
                "storage",
                "configuration",
                "accessories",
                "notes",
                "asset_detail_status",
                "assign_status",
                "approval_status_message",
                "created_at",
                "updated_at",
            ]:
                query |= Q(**{f"{field}__icontains": global_search})

            queryset = queryset.filter(query)

        assign_status = request.query_params.get("assign_status")
        asset_detail_status = request.query_params.get("asset_detail_status")

        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")

        requester_id = request.query_params.get("requester_id")
        approved_by_id = request.query_params.get("approved_by_id")

        query_params = request.query_params
        query_params_to_exclude = [
            "limit",
            "offset",
            "assign_status",
            "asset_detail_status",
            "requester_id",
            "approved_by_id",
            "global_search",
        ]
        required_query_params = self.remove_fields_from_dict(
            query_params, query_params_to_exclude
        )

        if limit:
            self.pagination.default_limit = limit
        if offset:
            self.pagination.default_offset = offset

        if asset_detail_status:
            statuses = asset_detail_status.split("|")
            queryset = queryset.filter(asset_detail_status__in=statuses)

        if assign_status:
            statuses = assign_status.split("|")
            queryset = queryset.filter(assign_status__in=statuses)

        filter_kwargs = {}
        for field, value in required_query_params.items():
            filter_kwargs[f"{field}__icontains"] = value

        # TODO How to filter using values of foreign tables
        if requester_id:
            filter_kwargs["requester_id"] = requester_id
        if approved_by_id:
            filter_kwargs["approved_by_id"] = approved_by_id
        queryset = queryset.filter(**filter_kwargs)

        # Apply pagination
        page = self.pagination.paginate_queryset(queryset, request)

        if page is not None:
            serializer = AssetReadSerializer(page, many=True)
            paginated_data = self.pagination.get_paginated_response(serializer.data)
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

    def remove_fields_from_dict(self, input_dict, fields_to_remove):
        return {
            key: value
            for key, value in input_dict.items()
            if key not in fields_to_remove
        }
