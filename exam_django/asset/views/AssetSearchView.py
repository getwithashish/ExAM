from django.core.exceptions import ValidationError
from django.db import DatabaseError
from rest_framework.exceptions import ParseError
from asset.models import Asset
from asset.serializers import AssetReadSerializer
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response


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
                response_data.data["message"] = "Assets retrieved successfully."
                return response_data
            else:
                return Response({"message": "No assets found."}, status=404)
        except (ValidationError, ParseError) as e:
            return Response({"message": str(e)}, status=400)
        except DatabaseError as e:
            return Response({"message": "Database error occurred."}, status=500)
        except Exception as e:
            # Log the error for debugging
            print(f"Unexpected error: {e}")
            return Response({"message": "An unexpected error occurred."}, status=500)
