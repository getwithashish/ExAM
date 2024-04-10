from asset.models import Asset
from notification.service.email_service import EmailService
from rest_framework import status
from rest_framework.renderers import JSONRenderer

class AssetMutationService:

    def __init__(self, asset_user_role_mutation_service):
        self.asset_user_role_mutation_service = asset_user_role_mutation_service

    def create_asset(self, serializer, request):
        email_service = EmailService()
        new_serializer, message, email_subject = (
            self.asset_user_role_mutation_service.create_asset(serializer, request)
        )
        new_serializer.validated_data["requester"] = request.user
        new_serializer.save()

        json_string = JSONRenderer().render(new_serializer.data).decode("utf-8")
        email_service.send_email(
            email_subject,
            "Serializer Data: {}".format(json_string),
            [
                "astg7542@gmail.com",
                "acj88178@gmail.com",
                "asimapalexperion23@gmail.com",
                "aidrin.varghese@experionglobal.com",
                "pavithraexperion@gmail.com",
            ],
        )

        return new_serializer.data, message, status.HTTP_201_CREATED

    def update_asset(self, serializer, request):
        email_service = EmailService()
        asset_uuid = request.data.get("asset_uuid")
        asset = Asset.objects.get(asset_uuid=asset_uuid)

        serializer = serializer(asset, data=request.data.get("data"), partial=True)

        if serializer.is_valid():
            new_serializer, message, email_subject = (
                self.asset_user_role_mutation_service.update_asset(
                    serializer, asset, request
                )
            )

            new_serializer.validated_data["requester"] = request.user
            new_serializer.save()

            json_string = JSONRenderer().render(new_serializer.data).decode("utf-8")
            email_service.send_email(
                email_subject,
                "Serializer Data: {}".format(json_string),
                [
                    "astg7542@gmail.com",
                    "acj88178@gmail.com",
                    "asimapalexperion23@gmail.com",
                    "aidrin.varghese@experionglobal.com",
                    "pavithraexperion@gmail.com",
                ],
            )

            return new_serializer.data, message, status.HTTP_200_OK  # Updated status code to HTTP_200_OK

        # Return appropriate response if serializer is invalid
        return None, "Invalid data provided", status.HTTP_400_BAD_REQUEST






# from asset.models import Asset
# from notification.service.email_service import EmailService
# from rest_framework import status
# from rest_framework.renderers import JSONRenderer


# class AssetMutationService:

#     def __init__(self, asset_user_role_mutation_service):
#         self.asset_user_role_mutation_service = asset_user_role_mutation_service

#     def create_asset(self, serializer, request):
#         email_service = EmailService()
#         new_serializer, message, email_subject = (
#             self.asset_user_role_mutation_service.create_asset(serializer, request)
#         )
#         new_serializer.validated_data["requester"] = request.user
#         new_serializer.save()

#         json_string = JSONRenderer().render(new_serializer.data).decode("utf-8")
#         email_service.send_email(
#             email_subject,
#             "Serializer Data: {}".format(json_string),
#             [
#                 "astg7542@gmail.com",
#                 "acj88178@gmail.com",
#                 "asimapalexperion23@gmail.com",
#                 "aidrin.varghese@experionglobal.com",
#                 "pavithraexperion@gmail.com",
#             ],
#         )

#         return new_serializer.data, message, status.HTTP_201_CREATED

#     def update_asset(self, serializer, request):
#         email_service = EmailService()
#         asset_uuid = request.data.get("asset_uuid")
#         asset = Asset.objects.get(asset_uuid=asset_uuid)

#         serializer = serializer(asset, data=request.data.get("data"), partial=True)

#         if serializer.is_valid():

#             new_serializer, message, email_subject = (
#                 self.asset_user_role_mutation_service.update_asset(
#                     serializer, asset, request
#                 )
#             )

#             new_serializer.validated_data["requester"] = request.user
#             new_serializer.save()

#             # TODO Retrieve email addresses of recipient from database
#             json_string = JSONRenderer().render(new_serializer.data).decode("utf-8")
#             email_service.send_email(
#                 email_subject,
#                 "Serializer Data: {}".format(json_string),
#                 [
#                     "astg7542@gmail.com",
#                     "acj88178@gmail.com",
#                     "asimapalexperion23@gmail.com",
#                     "aidrin.varghese@experionglobal.com",
#                     "pavithraexperion@gmail.com",
#                 ],
#             )

#             return new_serializer.data, message, status.HTTP_201_CREATED
