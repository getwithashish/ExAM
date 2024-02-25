from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from request.models import Request
from request.serializers import RequestApprovalSerializer
from django.http import Http404


class RequestApprovalView(ListCreateAPIView, RetrieveUpdateDestroyAPIView):

    def get(self, request, *args, **kwargs):
        request_status = request.GET.get("request_status")
        if request_status:
            requestsList = Request.objects.filter(request_status=request_status.upper())
        else:
            requestsList = Request.objects.all()

        serializer = RequestApprovalSerializer(requestsList, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RequestApprovalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            request_object = Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise Http404
        request_object.request_status = "REJECTED"
        request_object.save()
        return Response(
            { "message": "Request has been rejected."},
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        try:
            request_object = Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            raise Http404
        serializer = RequestApprovalSerializer(
            request_object, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
