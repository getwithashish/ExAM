from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from request.models import Request
from request.serializers import RequestApprovalSerializer
from django.http import Http404


class RequestView(ListCreateAPIView):

    def get(self, request, *args, **kwargs):
        data = {}  # Initialize an empty data dictionary
        request_status = request.GET.get("request_status")

        if request_status and request_status.upper() not in [
            "PENDING",
            "REJECTED",
            "APPROVED",
        ]:
            data["error"] = "Invalid request_status provided"
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if request_status:
            requestsList = Request.objects.filter(request_status=request_status.upper())
        else:
            requestsList = Request.objects.all()

        serializer = RequestApprovalSerializer(requestsList, many=True)
        data["data"] = serializer.data  # Add serialized data to the response
        data["message"] = "Requests retrieved successfully"
        return Response(data, status=status.HTTP_200_OK)


class RequestApprovalUpdateView(RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    def post(self, request):
        serializer = RequestApprovalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = {}  # Initialize an empty data dictionary
        request_id = request.data.get("request_uuid")
        if not request_id:
            return Response(
                {"error": "Request id is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            request_object = Request.objects.get(pk=request_id)
        except Request.DoesNotExist:
            raise Http404
        if "request_status" in request.data:
            request_status = request.data["request_status"]
            if request_status == "Pending" or request_status == "Rejected":
                request_object.request_status = request_status
                request_object.save()
                serializer = RequestApprovalSerializer(request_object)
                data["data"] = serializer.data  # Add serialized data to the response
                data["message"] = "Request status updated successfully"
                return Response(data, status=status.HTTP_200_OK)
            else:
                data["error"] = "Invalid request_status"
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = RequestApprovalSerializer(
                request_object, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                data["data"] = serializer.data  # Add serialized data to the response
                data["message"] = "Request updated successfully"
                return Response(data, status=status.HTTP_200_OK)
            data["error"] = serializer.errors
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request):
    #     request_id = request.data.get("request_uuid")
    #     print(request_id)
    #     if not request_id:
    #         return Response({"message": "Request id is required"}, status=status.HTTP_400_BAD_REQUEST)
    #     try:
    #         request_object = Request.objects.get(pk=request_id)
    #     except Request.DoesNotExist:
    #         raise Http404

    #     if 'request_status' in request.data:
    #         request_status = request.data['request_status']
    #         if request_status == "Pending" or request_status == "Rejected":
    #             request_object.request_status = request_status
    #             request_object.save()
    #             serializer = RequestApprovalSerializer(request_object)
    #             return Response(serializer.data, status=status.HTTP_200_OK)
    #         else:
    #             return Response({"message": "Invalid request_status"}, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         serializer = RequestApprovalSerializer(
    #             request_object, data=request.data, partial=True
    #         )
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_200_OK)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, pk):
    #     try:
    #         request_object = Request.objects.get(pk=pk)
    #     except Request.DoesNotExist:
    #         raise Http404

    #     if 'request_status' in request.data:
    #         request_status = request.data['request_status']
    #         if request_status == "Pending" or request_status == "Rejected":
    #             request_object.request_status = request_status
    #             request_object.save()
    #             serializer = RequestApprovalSerializer(request_object)
    #             return Response(serializer.data, status=status.HTTP_200_OK)
    #         else:
    #             return Response({"message": "Invalid request_status"}, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         serializer = RequestApprovalSerializer(
    #             request_object, data=request.data, partial=True
    #         )
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_200_OK)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def patch(self, request, pk):
    #     try:
    #         request_object = Request.objects.get(pk=pk)
    #     except Request.DoesNotExist:
    #         raise Http404
    #     serializer = RequestApprovalSerializer(
    #         request_object, data=request.data, partial=True
    #     )
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# def delete(self, request, pk):
#     try:
#         request_object = Request.objects.get(pk=pk)
#     except Request.DoesNotExist:
#         raise Http404
#     request_object.request_status = "REJECTED"
#     request_object.save()
#     return Response(
#         { "message": "Request has been rejected."},
#         status=status.HTTP_200_OK,
#     )
