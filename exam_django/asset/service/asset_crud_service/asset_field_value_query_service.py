import json
from rest_framework import status
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination

from asset.service.asset_crud_service.asset_query_abstract import AssetQueryAbstract
from asset.models.asset import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from utils.table_util import TableUtil
from exceptions import NotAcceptableOperationException, NotFoundException
from messages import (
    ASSET_FIELD_NOT_FILTERABLE,
    ASSET_FIELD_NOT_FOUND,
    ASSET_FIELD_VALUE_LIST_SUCCESSFULLY_RETRIEVED,
    ASSET_FIELD_VALUE_QUERY_PARAM_NOT_FOUND,
)


class AssetFieldValueQueryService(AssetQueryAbstract):

    #  Used for autocomplete functionality
    def get_asset_details(self, serializer, request):

        self.pagination = LimitOffsetPagination()
        queryset = Asset.objects.all()

        unfilterable_fields = [
            "asset_uuid",
            "version",
            "asset_category",
            "date_of_purchase",
            "status",
            "notes",
            "approval_status_message",
            "warranty_period",
            "asset_detail_status",
            "assign_status",
            "created_at",
            "updated_at",
        ]

        foreign_fields = [
            "asset_type",
            "custodian",
            "location",
            "invoice_location",
            "business_unit",
            "memory",
            "approved_by",
            "requester",
        ]

        asset_field_value_filter = request.query_params.get("asset_field_value_filter")
        if asset_field_value_filter:
            asset_field_object = json.loads(asset_field_value_filter)
            asset_field_name = list(asset_field_object.keys())[0]
            asset_field_value = asset_field_object.get(asset_field_name)

            if (
                asset_field_name in unfilterable_fields
                or asset_field_name in foreign_fields
            ):
                raise NotAcceptableOperationException(
                    {},
                    ASSET_FIELD_NOT_FILTERABLE,
                    status.HTTP_406_NOT_ACCEPTABLE,
                )

            if TableUtil.field_exists_in_table(Asset, asset_field_name):
                filterConditionQObject = Q(
                    **{asset_field_name + "__icontains": asset_field_value}
                )
                queryset = queryset.filter(filterConditionQObject)
            else:
                raise NotFoundException(
                    {},
                    ASSET_FIELD_NOT_FOUND,
                    status.HTTP_406_NOT_ACCEPTABLE,
                )

            fields_to_select = [asset_field_name]
            queryset = queryset.distinct()
            queryset = queryset.values(*fields_to_select)

            serializer_class = type(
                "DynamicSerializer",
                (AssetReadSerializer,),
                {
                    "Meta": type(
                        "Meta", (), {"model": Asset, "fields": fields_to_select}
                    )
                },
            )

            page = self.pagination.paginate_queryset(queryset, request)
            if page is not None:
                serializer = serializer_class(page, many=True)
                serializer = self.pagination.get_paginated_response(serializer.data)

            else:
                serializer = serializer_class(queryset, many=True)

            return (
                serializer.data,
                ASSET_FIELD_VALUE_LIST_SUCCESSFULLY_RETRIEVED,
                status.HTTP_200_OK,
            )

        else:
            raise NotFoundException(
                {},
                ASSET_FIELD_VALUE_QUERY_PARAM_NOT_FOUND,
                status.HTTP_406_NOT_ACCEPTABLE,
            )
