from typing import Dict, Any, Tuple, List
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.db.models import Q, QuerySet
from django.utils import timezone
from rest_framework.request import Request
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
import sentry_sdk

from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.service.asset_crud_service.asset_query_abstract import AssetQueryAbstract
from messages import ASSET_LIST_SUCCESSFULLY_RETRIEVED



class AssetNormalQueryService(AssetQueryAbstract):
    """
    Service class for querying assets with normal retrieval methods.

    This class handles filtering and pagination of asset data based on various query parameters.
    """

    SORTABLE_FIELDS = {
        "product_name": "product_name",
        "location": "location__location_name",
        "asset_type": "asset_type__asset_type_name",
        "asset_category": "asset_category",
        "date_of_purchase": "date_of_purchase",
        "warranty_period": "warranty_period",
        "requester": "requester__first_name",
        "custodian": "custodian__employee_name",
        "model_number": "model_number",
        "approved_by": "approved_by__first_name",
        "invoice_location": "invoice_location__location_name",
        "memory": "memory__memory_space",
        "created_at": "created_at",
        "updated_at": "updated_at",
    }

    def __init__(self):
        self.pagination = LimitOffsetPagination()

    def filter_queryset(self, request: Request) -> QuerySet:
        """
        Filter the queryset of assets based on request parameters.

        Args:
            request (Request): The request object containing query parameters.

        Returns:
            QuerySet: The filtered queryset of assets.
        """

        deleted = request.query_params.get("deleted")

        is_deleted = False
        if deleted:
            is_deleted = True

        queryset = Asset.objects.all().filter(is_deleted=is_deleted)

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
            "deleted",
            "json_logic",
            "export_format",
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
            if sort_by in self.SORTABLE_FIELDS.keys():
                if sort_order == "asc":
                    queryset = queryset.order_by(self.SORTABLE_FIELDS.get(sort_by))
                elif sort_order == "desc":
                    queryset = queryset.order_by(
                        f"-{self.SORTABLE_FIELDS.get(sort_by)}"
                    )
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
                print("Error Occurred: ", e)
                sentry_sdk.capture_exception(e)

        return queryset

    def get_asset_details(self, serializer: Any, request: Request) -> Tuple[Any, str, int]:
        """
        Get the details of the assets based on the serialized data and request.

        Args:
            serializer (Any): The serializer used to serialize the asset data.
            request (Request): The request object containing query parameters.

        Returns:
            Tuple[Any, str, int]: A tuple containing the serialized asset data, message, and HTTP status code.
        """

        queryset = self.filter_queryset(request=request)

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

    def get_queryset_from_global_search(self, global_search: str, queryset: QuerySet) -> QuerySet:
        """
        Filter the queryset based on a global search query.

        Args:
            global_search (str): The search string to filter on.
            queryset (QuerySet): The original queryset of assets.

        Returns:
            QuerySet: The filtered queryset based on the global search.
        """

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

    def remove_fields_from_dict(self, input_dict: Dict[str, Any], fields_to_remove: List[str]) -> Dict[str, Any]:
        """
        Remove specified fields from the input dictionary.

        Args:
            input_dict (Dict[str, Any]): The original dictionary.
            fields_to_remove (List[str]): The list of fields to remove.

        Returns:
            Dict[str, Any]: The filtered dictionary.
        """

        return {
            key: value
            for key, value in input_dict.items()
            if key not in fields_to_remove
        }
