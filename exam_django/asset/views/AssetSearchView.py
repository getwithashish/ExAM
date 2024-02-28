# from django.http import JsonResponse
# from django.views import View
# from asset.models import Asset
# from asset.serializers import AssetSerializer
# from rest_framework.generics import ListAPIView
# from rest_framework import generics
# from django.db.models import Q
# from django.shortcuts import get_object_or_404


# # Search assets by name
# class AssetSearchByNameView(View):
#     def get(self, request):
#         query_param = request.GET.get("q")
#         if query_param:
#             assets = Asset.objects.filter(product_name__icontains=query_param)
#         else:
#             assets = Asset.objects.all()

#         data = list(assets.values())
#         return JsonResponse(data, safe=False)


# # Search assets by serial number
# class AssetSearchBySerialNumberAPIView(ListAPIView):
#     serializer_class = AssetSerializer

#     def get_queryset(self):
#         serial_number = self.request.query_params.get("serial_number", None)
#         if serial_number:
#             queryset = Asset.objects.filter(
#                 serial_number__startswith=serial_number)
#             return queryset
#         else:
#             return (
#                 Asset.objects.none()
#             )

# # Search based on model number
# class AssetSearchByModelNumberView(generics.ListAPIView):
#     serializer_class = AssetSerializer

#     def get_queryset(self):
#         model_number = self.request.query_params.get("model_number", None)
#         if model_number:
#             queryset = Asset.objects.filter(
#                 model_number__startswith=model_number)
#             return queryset
#         else:
#             return (
#                 Asset.objects.none()
#             )

# # Search assest by asset ID
# class AssetSearchByAssetIDView(generics.ListAPIView):
#     serializer_class = AssetSerializer

#     def get_queryset(self):
#         asset_id = self.request.query_params.get("asset_id", None)
#         if asset_id:
#             queryset = Asset.objects.filter(asset_id__startswith=asset_id)
#             return queryset
#         else:
#             return (
#                 Asset.objects.none()
#             )


# Real code---------------------

# from django.http import JsonResponse
# from django.views import View
# from asset.models import Asset
# from asset.serializers import AssetSerializer
# from django.db.models import Q

# class AssetSearchWithFilterView(View):
#     def get(self, request, *args, **kwargs):
#         # search_type = kwargs.get("search_type")
#         query_param = request.GET.get("q")
#         search_type = request.GET.get("search_type")
#         # asset_name = request.GET.get("name")
#         # serail_number = request.GET.get("serial_number")

#         if search_type is None and query_param is None:
#             return JsonResponse(
#                 {"error": "Both search_type and q parameters are required."}, status=400
#             )

#         # Define the initial filter based on the provided search_type
#         initial_filter = {
#             # "name": Q(product_name__icontains=query_param),
#             "serial_number": Q(serial_number__startswith=query_param),
#             "model_number": Q(model_number__startswith=query_param),
#             "asset_id": Q(asset_id__startswith=query_param),
#         }
#         # name_filter = Q(product_name__icontains=query_param) | Q(product_name__regex=r'\b\d+\b')
#         # print(name_filter)
#         # initial_filter["name"] = name_filter

#         name_filter = Q(product_name__icontains=query_param) | Q(
#             product_name__regex=r"\b{}\b".format(query_param)
#         )
#         print(name_filter)
#         initial_filter["name"] = name_filter

#         # Get the initial filter criteria
#         initial_filter_criteria = initial_filter.get(search_type)
#         print(initial_filter_criteria)
#         if not initial_filter_criteria:
#             return JsonResponse({"error": "Invalid search_type provided."}, status=400)

#         # Apply the initial filter
#         assets = Asset.objects.filter(initial_filter_criteria)

#         # Optionally add another search type if provided
#         additional_search_type = request.GET.get("additional_search_type")
#         if additional_search_type:
#             additional_filter = initial_filter.get(additional_search_type)
#             if not additional_filter:
#                 return JsonResponse(
#                     {"error": "Invalid additional_search_type provided."}, status=400
#                 )
#             assets = assets.filter(additional_filter)

#         data = list(AssetSerializer(assets, many=True).data)
#         return JsonResponse(data, safe=False)


# Real code -------------------
# -----------------------

# from django.http import JsonResponse
# from django.views import View
# from asset.models import Asset
# from asset.serializers import AssetSerializer
# from django.db.models import Q

# class AssetSearchWithFilterView(View):
#     def get(self, request, *args, **kwargs):
#         name = request.GET.get("name")
#         serial_number = request.GET.get("serial_number")
#         model_number = request.GET.get("model_number")
#         asset_id = request.GET.get("asset_id")

#         filters = []

#         if name:
#             filters.append(Q(product_name__icontains=name) | Q(product_name__regex=r"\b{}\b".format(name)))
#         if serial_number:
#             filters.append(Q(serial_number__startswith=serial_number))
#         if model_number:
#             filters.append(Q(model_number__startswith=model_number))
#         if asset_id:
#             filters.append(Q(asset_id__startswith=asset_id))

#         # Combine all filters with OR operator
#         combined_filter = filters.pop() if filters else Q()

#         for query_filter in filters:
#             combined_filter |= query_filter

#         if combined_filter:
#             assets = Asset.objects.filter(combined_filter)
#         else:
#             assets = Asset.objects.all()  # Fetch all assets when no filters are provided

#         data = list(AssetSerializer(assets, many=True).data)
#         return JsonResponse(data, safe=False)

# -------------------


# from django.http import JsonResponse
# from django.views import View
# from rest_framework.generics import ListAPIView
# from rest_framework.filters import SearchFilter
# from rest_framework.response import Response
# from rest_framework import status
# from asset.models import Asset
# from asset.serializers import AssetSerializer
# from django.db.models import Q

# class AssetSearchWithFilterView(ListAPIView):

#     filter_backends = [SearchFilter]
#     search_fields = ["product_name", "model_number", "serial_number", "asset_id", "os"]

#     def list(self, request, *args, **kwargs):
#         # self.queryset = Asset.objects.all()
#         # queryset = self.filter_queryset(self.get_queryset())
#         queryset = self.filter_queryset(Asset.objects.all())
#         # limit = request.query_params.get("limit")
#         # offset = request.query_params.get("offset")

#         # if limit:
#         #     self.pagination_class.default_limit = limit

#         # if offset:
#         #     self.pagination_class.default_offset = offset

#         # Applying pagination
#         # page = self.paginate_queryset(queryset)
#         # if page is not None:
#         #     serializer = self.get_serializer(page, many=True)
#         #     return self.get_paginated_response(serializer.data)

#         serializer = AssetSerializer(queryset, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------REAL REAL cODE


# from django.http import JsonResponse
# from django.views import View
# from asset.models import Asset
# from asset.serializers import AssetSerializer
# from django.db.models import Q
# from rest_framework.pagination import LimitOffsetPagination


# class AssetSearchWithFilterView(View):
#     pagination_class = LimitOffsetPagination

#     def get(self, request, *args, **kwargs):
#         name = request.GET.get("name")
#         serial_number = request.GET.get("serial_number")
#         model_number = request.GET.get("model_number")
#         asset_id = request.GET.get("asset_id")

#         filters = []

#         if name:
#             filters.append(
#                 Q(product_name__icontains=name)
#                 | Q(product_name__regex=r"\b{}\b".format(name))
#             )
#         if serial_number:
#             filters.append(Q(serial_number__startswith=serial_number))
#         if model_number:
#             filters.append(Q(model_number__startswith=model_number))
#         if asset_id:
#             filters.append(Q(asset_id__startswith=asset_id))

#         # Combine all filters with OR operator
#         combined_filter = filters.pop() if filters else Q()

#         for query_filter in filters:
#             combined_filter |= query_filter

#         assets = Asset.objects.filter(combined_filter)

#         if assets:
#             # Assets found, return them
#             data = list(AssetSerializer(assets, many=True).data)
#             return JsonResponse(
#                 {"message": "Assets retrieved successfully", "data": data}, safe=False
#             )
#         else:
#             # No assets found
#             return JsonResponse({"message": "No assets found"}, status=404) 


# from django.http import JsonResponse
from django.views import View
from asset.models import Asset
from asset.serializers import AssetSerializer
from django.db.models import Q
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class AssetSearchWithFilterView(View):
    def get(self, request, *args, **kwargs):
        name = request.GET.get("name")
        serial_number = request.GET.get("serial_number")
        model_number = request.GET.get("model_number")
        asset_id = request.GET.get("asset_id")

        filters = []

        if name:
            filters.append(
                Q(product_name__icontains=name) | Q(product_name__regex=r"\b{}\b".format(name))
            )
        if serial_number:
            filters.append(Q(serial_number__startswith=serial_number))
        if model_number:
            filters.append(Q(model_number__startswith=model_number))
        if asset_id:
            filters.append(Q(asset_id__startswith=asset_id))

            # Combine all filters with OR operator
        combined_filter = filters.pop() if filters else Q()

        for query_filter in filters:
            combined_filter |= query_filter

        assets = Asset.objects.filter(combined_filter)

        # Apply pagination
        paginator = LimitOffsetPagination()
        paginated_assets = paginator.paginate_queryset(assets, request)

        # Serialize paginated assets
        serialized_assets = AssetSerializer(paginated_assets, many=True).data    
        return Response(serialized_assets)
