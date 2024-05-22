from asset.models import Asset
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.service.asset_crud_service.asset_query_abstract import AssetQueryAbstract
from messages import ASSET_LIST_SUCCESSFULLY_RETRIEVED
from dateutil.relativedelta import relativedelta
from django.utils import timezone


class AssetNormalQueryService(AssetQueryAbstract):
    SORTABLE_FIELDS = [
        "product_name",
        "location",
        "asset_type",
        "version",
        "date_of_purchase",
        "warranty_period",
        "requester",
        "custodian",
        "approved_by",
        "invoice_location",
        "memory",
        "created_at",
        "updated_at",
    ]

    def get_asset_details(self, serializer, request):
        self.pagination = LimitOffsetPagination()
        queryset = Asset.objects.all()
        queryset = queryset.filter(is_deleted=False)

        global_search = request.query_params.get("global_search")

        if global_search:
            queryset = self.get_queryset_from_global_search(global_search, queryset)

        asset_status = request.query_params.get("status")
        assign_status = request.query_params.get("assign_status")
        asset_detail_status = request.query_params.get("asset_detail_status")

        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")

        requester_id = request.query_params.get("requester_id")
        approved_by_id = request.query_params.get("approved_by_id")

        asset_type_id = request.query_params.get("asset_type")
        business_unit_id = request.query_params.get("business_unit")
        location_id = request.query_params.get("location")
        invoice_location_id = request.query_params.get("invoice_location")
        memory_id = request.query_params.get("memory")

        sort_by = request.query_params.get("sort_by")
        sort_order = request.query_params.get("sort_order")  # 'asc' or 'desc'

        expired = request.query_params.get("expired")

        query_params = request.query_params
        query_params_to_exclude = [
            "limit",
            "offset",
            "status",
            "assign_status",
            "asset_detail_status",
            "requester_id",
            "approved_by_id",
            "asset_type",
            "business_unit",
            "location",
            "invoice_location",
            "memory",
            "global_search",
            "sort_by",
            "sort_order",
            "expired",
        ]
        required_query_params = self.remove_fields_from_dict(
            query_params, query_params_to_exclude
        )

        if limit:
            self.pagination.default_limit = limit
        if offset:
            self.pagination.default_offset = offset

        if asset_status:
            statuses = asset_status.split("|")
            queryset = queryset.filter(status__in=statuses)

        if asset_detail_status:
            statuses = asset_detail_status.split("|")
            queryset = queryset.filter(asset_detail_status__in=statuses)

        if assign_status:
            statuses = assign_status.split("|")
            queryset = queryset.filter(assign_status__in=statuses)

        filter_kwargs = {}
        for field, value in required_query_params.items():
            filter_kwargs[f"{field}__icontains"] = value

        if sort_by:
            if sort_by in self.SORTABLE_FIELDS:
                if sort_order == "asc":
                    queryset = queryset.order_by(sort_by)
                elif sort_order == "desc":
                    queryset = queryset.order_by(f"-{sort_by}")
            else:
                pass

        if requester_id:
            filter_kwargs["requester_id"] = requester_id
        if approved_by_id:
            filter_kwargs["approved_by_id"] = approved_by_id

        if asset_type_id:
            filter_kwargs["asset_type_id"] = asset_type_id
        if business_unit_id:
            filter_kwargs["business_unit_id"] = business_unit_id
        if location_id:
            filter_kwargs["location_id"] = location_id
        if invoice_location_id:
            filter_kwargs["invoice_location_id"] = invoice_location_id
        if memory_id:
            filter_kwargs["memory_id"] = memory_id

        queryset = queryset.filter(**filter_kwargs)

        if expired:
            try:
                current_date = timezone.now().date()

                queryset = queryset.exclude(date_of_purchase__isnull=True).exclude(
                    warranty_period__isnull=True
                )
                for ele in queryset:
                    if (
                        ele.date_of_purchase + relativedelta(months=ele.warranty_period)
                    ) > current_date:
                        queryset = queryset.exclude(asset_uuid=ele.asset_uuid)
            except Exception as e:
                print("Error Occured: ", e)

        page = self.pagination.paginate_queryset(queryset, request)

        if page is not None:
            serializer = AssetReadSerializer(page, many=True)
            paginated_data = self.pagination.get_paginated_response(serializer.data)
            return (
                paginated_data.data,
                ASSET_LIST_SUCCESSFULLY_RETRIEVED,
                status.HTTP_200_OK,
            )

        serializer = AssetReadSerializer(queryset, many=True)
        return serializer.data, ASSET_LIST_SUCCESSFULLY_RETRIEVED, status.HTTP_200_OK

    def get_queryset_from_global_search(self, global_search, queryset):
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

        query |= Q(custodian__employee_name__icontains=global_search)
        query |= Q(location__location_name__icontains=global_search)
        query |= Q(approved_by__username__icontains=global_search)
        query |= Q(requester__username__icontains=global_search)
        query |= Q(memory__memory_space__icontains=global_search)
        query |= Q(business_unit__business_unit_name__icontains=global_search)
        query |= Q(asset_type__asset_type_name__icontains=global_search)

        queryset = queryset.filter(query)
        return queryset

    def remove_fields_from_dict(self, input_dict, fields_to_remove):
        return {
            key: value
            for key, value in input_dict.items()
            if key not in fields_to_remove
        }
