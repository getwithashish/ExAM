# exam_django/asset/views/ConcederView.py

from rest_framework.generics import ListAPIView
from asset.models import User
from asset.serializers import UserSerializer


class ConcederView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()

        # Check if a query parameter is provided
        query_param = self.request.query_params.get("name")
        if query_param:
            queryset = queryset.filter(
                first_name__icontains=query_param
            ) | queryset.filter(last_name__icontains=query_param)

        return queryset
