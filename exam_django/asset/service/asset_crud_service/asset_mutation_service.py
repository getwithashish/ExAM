from jwt import decode, InvalidTokenError
from django.conf import settings
from asset.models import Asset
from notification.service.email_service import EmailService
from rest_framework import status

 
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
 
   
    def _construct_create_email_body(self, asset_data, requester_name):
        asset_info = (
            f"Dear Lead,\n"
            f"This is to inform you that a new asset has been created by {requester_name}\n"
            f"The asset deatails are given below\n\n"
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
            f"Please make sure to familiarize yourself with the specifications of the newly created asset.\n\n"
            f"We trust that the asset will be utilized effectively to enhance the productivity.\n\n"
            f"This asset was created by {requester_name}.\n\n"
            f"For any inquiries, please contact our IT support team at support@example.com or call us at +1 234-567-8901.\n"
        )
 
        return asset_info
 
   
 
    def update_asset(self, serializer, request):
        email_service = EmailService()
        asset_uuid = request.data.get("asset_uuid")

        # Fetch the asset with related fields using select_related
        asset = Asset.objects.select_related(
            'asset_type', 'business_unit', 'custodian', 'approved_by', 'requester',
            'location', 'invoice_location', 'memory'
        ).get(asset_uuid=asset_uuid)

        # Capture old asset data with related fields
        old_asset_data = {
            'asset_type': asset.asset_type.asset_type_name if asset.asset_type else None,
            'business_unit': asset.business_unit.business_unit_name if asset.business_unit else None,
            'custodian': asset.custodian.employee_name if asset.custodian else None,
            'approved_by': asset.approved_by.username if asset.approved_by else None,
            'requester': asset.requester.username if asset.requester else None,
            'location': asset.location.location_name if asset.location else None,
            'invoice_location': asset.invoice_location.location_name if asset.invoice_location else None,
            'memory': asset.memory.memory_space if asset.memory else None,
            'asset_category': asset.asset_category,
            'product_name': asset.product_name,
            'model_number': asset.model_number,
            'serial_number': asset.serial_number,
            'owner': asset.owner,
            'date_of_purchase': asset.date_of_purchase,
            'status': asset.status,
            'warranty_period': asset.warranty_period,
            'os': asset.os,
            'os_version': asset.os_version,
            'mobile_os': asset.mobile_os,
            'processor': asset.processor,
            'processor_gen': asset.processor_gen,
            'storage': asset.storage,
            'configuration': asset.configuration,
            'accessories': asset.accessories,
            'notes': asset.notes,
            'asset_detail_status': asset.asset_detail_status,
            'assign_status': asset.assign_status,
            'approval_status_message': asset.approval_status_message,
            'is_deleted': asset.is_deleted,
        }
        #print("The OLD warranty period:", old_asset_data['warranty_period'])


        # Deserialize the data to update the asset
        serializer = serializer(asset, data=request.data.get("data"), partial=True)

        if serializer.is_valid():
            new_serializer, message, email_subject = (
                self.asset_user_role_mutation_service.update_asset(
                    serializer, asset, request
                )
            )

            # Update the asset with new values
            new_serializer.validated_data["requester"] = request.user
            new_serializer.save()

            # Refetch the asset with updated values
            asset.refresh_from_db()

            # Capture new asset data with related fields
            new_asset_data = {
                'asset_type': asset.asset_type.asset_type_name if asset.asset_type else None,
                'business_unit': asset.business_unit.business_unit_name if asset.business_unit else None,
                'custodian': asset.custodian.employee_name if asset.custodian else None,
                'approved_by': asset.approved_by.username if asset.approved_by else None,
                'requester': asset.requester.username if asset.requester else None,
                'location': asset.location.location_name if asset.location else None,
                'invoice_location': asset.invoice_location.location_name if asset.invoice_location else None,
                'memory': asset.memory.memory_space if asset.memory else None,
                'asset_category': asset.asset_category,
                'product_name': asset.product_name,
                'model_number': asset.model_number,
                'serial_number': asset.serial_number,
                'owner': asset.owner,
                'date_of_purchase': asset.date_of_purchase,
                'status': asset.status,
                'warranty_period': asset.warranty_period,
                'os': asset.os,
                'os_version': asset.os_version,
                'mobile_os': asset.mobile_os,
                'processor': asset.processor,
                'processor_gen': asset.processor_gen,
                'storage': asset.storage,
                'configuration': asset.configuration,
                'accessories': asset.accessories,
                'notes': asset.notes,
                'asset_detail_status': asset.asset_detail_status,
                'assign_status': asset.assign_status,
                'approval_status_message': asset.approval_status_message,
                'is_deleted': asset.is_deleted,
            }

            #print("The OLD warranty period:",+ new_asset_data['warranty_period'])


            # Fields to be excluded from comparison
            excluded_fields = {'created_at', 'updated_at', 'asset_uuid', 'asset_detail_status'}

            # Find changed fields and their actual values
            changed_fields = []
            for field in new_asset_data:
                if field in excluded_fields:
                    continue
                old_value = old_asset_data.get(field)
                new_value = new_asset_data.get(field)
                if old_value != new_value:
                    changed_fields.append((field, old_value, new_value))

            # Construct email body with changed fields and actual values in plain text format
            if changed_fields:
                email_body = self._construct_update_email_body(
                    asset, changed_fields, request.user.get_full_name()
                )
                
                email_subject=f"ASSET UPDATION SUCCESSFUL"
                email_service.send_email(
                    email_subject,
                    email_body,
                    ["asimapalexperion23@gmail.com",
                     "astg7542@gmail.com",
                    "acj88178@gmail.com",
                    "aidrin.varghese@experionglobal.com",
                    "pavithraexperion@gmail.com",],
                )

            return new_asset_data, message, status.HTTP_200_OK
    def _construct_update_email_body(self, asset, changed_fields, requester_name):
            
            email_body = f"""
        Dear Lead,

        The following asset has been updated by {requester_name}:

        Asset: {asset.product_name} (UUID: {asset.asset_uuid})

        Changes:
        """
            change_number = 1
            for field, old_value, new_value in changed_fields:
                email_body += f"""
        {change_number}. {field.capitalize()} has been changed from "{old_value}" to "{new_value}".
        """
                change_number += 1
            email_body += """
        For any inquiries, please contact our IT support team at support@example.com or call us at +1 234-567-8901.

        Best regards and Thankyou,

        Experion Technologies
        Australia | Germany | India | Netherlands | Switzerland | UK | USA
        Clutch - Top 20 Digital Solutions - Worldwide; Texas Top 100
        Great Place to Work 2021
        Major Contender - Everest Group's Digital Product Engineering Peak Matrix Assessment 2022
        2022 Frost & Sullivan Global Software Product Engineering Customer Value Leadership Award
        Inc. 5000- 4-time winner.




        """
            return email_body