from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import AssetSerializer
from asset.models import Asset
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter


class AssetView(ListCreateAPIView):
    pagination_class = LimitOffsetPagination
    filter_backends = [SearchFilter]

    def post(self, request, format=None):
        serializer = AssetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            queryset = Asset.objects.all()
            serializer = AssetSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            queryset = Asset.objects.filter(is_deleted=False, status=True).order_by(
                "id"
            )

            # Retrieve filter parameters from URL query parameters
            filter_params = {}
            for key, value in request.query_params.items():
                if key in ["filter_field1", "filter_field2", "filter_field3"]:
                    filter_params[key] = value

            if filter_params:
                queryset = queryset.filter(**filter_params)

            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = AssetSerializer(page, many=True)
                res_data = {
                    "count": self.paginator.count,
                    "next": self.paginator.get_next_link(),
                    "previous": self.paginator.get_previous_link(),
                    "results": serializer.data,
                }
                return Response(res_data, status=status.HTTP_200_OK)

            serializer = AssetSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                "Something went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
