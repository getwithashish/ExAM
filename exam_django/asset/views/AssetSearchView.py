from django.core.exceptions import ValidationError
from django.db import DatabaseError
from rest_framework.exceptions import ParseError
from asset.models import Asset
from asset.serializers import AssetReadSerializer
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import status

# from rest_framework.response import Response
from response import APIResponse
from messages import (
    ASSET_LIST_SUCCESSFULLY_RETRIEVED,
    ASSET_NOT_FOUND,
    BAD_REQUEST_ERROR,
    DATABASE_ERROR,
)


class AssetSearchWithFilterView(APIView):

    def get(self, request, *args, **kwargs):
        try:
            name = request.GET.get("name")
            serial_number = request.GET.get("serial_number")
            model_number = request.GET.get("model_number")
            asset_id = request.GET.get("asset_id")

            filters = []

            if name:
                filters.append(
                    Q(product_name__icontains=name)
                    | Q(product_name__regex=r"\b{}\b".format(name))
                )
            if serial_number:
                filters.append(Q(serial_number__startswith=serial_number))
            if model_number:
                filters.append(Q(model_number__startswith=model_number))
            if asset_id:
                filters.append(Q(asset_id__startswith=asset_id))

            combined_filter = Q()
            for query_filter in filters:
                combined_filter &= query_filter

            assets = Asset.objects.filter(combined_filter)

            if assets.exists():
                # Pagination
                paginator = PageNumberPagination()
                paginated_assets = paginator.paginate_queryset(assets, request)
                serializer = AssetReadSerializer(paginated_assets, many=True)
                response_data = paginator.get_paginated_response(serializer.data)

                return APIResponse(
                    data=response_data.data,
                    message=ASSET_LIST_SUCCESSFULLY_RETRIEVED,
                    status=status.HTTP_201_CREATED,
                )

            else:

                return APIResponse(
                    data=[],
                    message=ASSET_NOT_FOUND,
                    status=status.HTTP_404_NOT_FOUND,
                )

        except (ValidationError, ParseError):

            return APIResponse(
                data=[],
                message=BAD_REQUEST_ERROR,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DatabaseError:

            return APIResponse(
                data=[],
                message=DATABASE_ERROR,
                status=status.ASSET_NOT_FOUND,
            )
