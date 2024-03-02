from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from asset.serializers import UserSerializer
from asset.models import User

from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# @permission_classes((IsAuthenticated, ))
@api_view(["GET"])
def index(request):
    try:
        print("User: ", request.user)
        print("User Scope: ", request.user.email)
        return JsonResponse({"status": request.user.user_scope})
    except Exception as e:
        print(e)
        return JsonResponse({"status": "Unauthorized"})


class UserView(ListCreateAPIView):
    def post(self, request, format=None):
        queryset = User.objects.all()
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        try:
            queryset = User.objects.all()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
