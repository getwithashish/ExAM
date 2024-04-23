
from jwt import decode, InvalidTokenError
from django.conf import settings
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
 
        # Decode the JWT token to get user information
        token = request.headers.get("Authorization").split()[1]  # Assuming the JWT token is in the Authorization header
        try:
            decoded_token = decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            requester_name = decoded_token.get("username")
            print(requester_name)
        except InvalidTokenError:
            requester_name = "Unknown"
 
        new_serializer.validated_data["requester"] = request.user
        new_serializer.save()
 
        asset_data = new_serializer.data
        email_body = self._construct_create_email_body(asset_data, requester_name)
 
        email_service.send_email(
            email_subject,
            email_body,
            [
                "astg7542@gmail.com",
                "acj88178@gmail.com",
                "asimapalexperion23@gmail.com",
                "aidrin.varghese@experionglobal.com",
                "pavithraexperion@gmail.com",
            ],
        )
 
        return asset_data, message, status.HTTP_201_CREATED
 
    def update_asset(self, serializer, request):
        email_service = EmailService()
        asset_uuid = request.data.get("asset_uuid")
       
        # Fetch the asset
        asset = Asset.objects.get(asset_uuid=asset_uuid)
       
        # Deserialize the data to update the asset
        serializer = serializer(asset, data=request.data.get("data"), partial=True)
 
        if serializer.is_valid():
            old_asset_data = asset.__dict__
 
            new_serializer, message, email_subject = (
                self.asset_user_role_mutation_service.update_asset(
                    serializer, asset, request
                )
            )
 
            new_serializer.validated_data["requester"] = request.user
            new_serializer.save()
 
            new_asset_data = new_serializer.data
 
            # Find changed fields and their actual values
            changed_fields = []
            for field in new_asset_data:
                if new_asset_data[field] != old_asset_data.get(field):
                    # Fetch previous value using join query
                    previous_value = getattr(asset, field)
                    changed_fields.append((field, previous_value, new_asset_data[field]))
 
            # Construct email body with changed fields and actual values
            if changed_fields:
                email_body = self._construct_update_email_body(
                    asset, changed_fields, request.user.get_full_name()
                )
 
                email_service.send_email(
                    email_subject,
                    email_body,
                    [
                        "asimapalexperion23@gmail.com",
                    ],
                )
 
            return new_asset_data, message, status.HTTP_200_OK
 
        return None, "Invalid data provided", status.HTTP_400_BAD_REQUEST
    def _construct_create_email_body(self, asset_data, requester_name):
        asset_info = (
            f"Asset Name: {asset_data['product_name']}\n"
            f"Model: {asset_data['model_number']}\n"
            f"Serial Number: {asset_data['serial_number']}\n"
            f"Asset Status: {asset_data['status']}\n"
            f"Date of Purchase: {asset_data['date_of_purchase']}\n"
            f"Location: {asset_data['location']}\n"
            f"Business Unit: {asset_data['business_unit']}\n"
            f"Operating System: {asset_data['os']}\n"
            f"OS Version: {asset_data['os_version']}\n"
            f"Processor: {asset_data['processor']}\n"
            f"Memory: {asset_data['memory']}\n"
            f"Storage: {asset_data['storage']}\n"
            f"Configuration: {asset_data['configuration']}\n"
            f"Accessories: {asset_data['accessories']}\n"
            f"Notes: {asset_data['notes']}\n\n"
            f"Please make sure to familiarize yourself with the specifications of the assigned asset.\n\n"
            f"We trust that the asset will be utilized effectively to enhance the productivity.\n\n"
            f"This asset was created by {requester_name}.\n\n"
            f"For any inquiries, please contact our IT support team at support@example.com or call us at +1 234-567-8901.\n"
        )
 
        return asset_info
 
    def _construct_update_email_body(self, asset, changed_fields, requester_name):
        changed_info = "\n".join([f"{field}: {previous_value} -> {new_value}" for field, previous_value, new_value in changed_fields])
 
        asset_info = (
            f"The following fields were updated:\n\n{changed_info}\n\n"
            f"This asset was updated by {requester_name}.\n\n"
            f"For any inquiries, please contact our IT support team at support@example.com or call us at +1 234-567-8901.\n"
        )
 
        return asset_info
 