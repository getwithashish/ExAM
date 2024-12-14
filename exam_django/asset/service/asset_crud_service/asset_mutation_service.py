from asset.models import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from notification.service.notification_service import NotificationService
from exceptions import ConflictException, SerializerException
from messages import ASSET_CONFLICT, INVALID_ASSET_DATA

from rest_framework import status


class AssetMutationService:
    def __init__(self, asset_user_role_mutation_service):
        self.asset_user_role_mutation_service = asset_user_role_mutation_service
        self.notification_service = NotificationService()

    def create_asset(self, serializer, request):
        try:
            asset = Asset.objects.get(asset_uuid=request.data.get("asset_uuid"))
            old_asset_data = AssetReadSerializer(asset).data
        except Asset.DoesNotExist:
            old_asset_data = None

        new_serializer, message, email_subject = (
            self.asset_user_role_mutation_service.create_asset(serializer, request)
        )

        new_serializer.validated_data["requester"] = request.user
        new_serializer = new_serializer.save()

        asset_data = AssetReadSerializer(new_serializer)
        asset_dict = asset_data.data.copy()
        asset_dict["old_asset_data"] = old_asset_data

        self.notification_service.send_notification(
            subject=email_subject, message=message, **asset_dict
        )

        return asset_data.data, message, status.HTTP_201_CREATED

    def update_asset(self, serializer, request):
        asset_uuid = request.data.get("asset_uuid")
        version = request.data.get("version")

        asset, old_asset_data = self._get_asset_and_old_data(asset_uuid)

        serializer = serializer(asset, data=request.data.get("data"), partial=True)
        if serializer.is_valid():
            new_serializer, message, email_subject = (
                self.asset_user_role_mutation_service.update_asset(
                    serializer, asset, request
                )
            )

            if asset.version != version:
                raise ConflictException({}, ASSET_CONFLICT, status.HTTP_409_CONFLICT)

            new_serializer.validated_data["requester"] = request.user
            new_serializer.validated_data["version"] = asset.version + 1
            updated_asset = new_serializer.save()
            updated_asset_serializer = AssetReadSerializer(updated_asset)

            asset.refresh_from_db()
            # Finding the changed fields between old asset data and new asset data
            new_asset_data = self._get_new_asset_data(updated_asset)

            changed_fields = self._get_changed_fields(old_asset_data, new_asset_data)

            asset_dict = updated_asset_serializer.data.copy()
            asset_dict["old_asset_data"] = old_asset_data
            asset_dict["changed_fields"] = changed_fields

            self.notification_service.send_notification(
                subject=email_subject, message=message, **asset_dict
            )

            return new_asset_data, message, status.HTTP_200_OK

        raise SerializerException(
            serializer.errors, INVALID_ASSET_DATA, status.HTTP_400_BAD_REQUEST
        )

    def _get_asset_and_old_data(self, asset_uuid):
        asset = Asset.objects.select_related(
            "asset_type",
            "business_unit",
            "custodian",
            "approved_by",
            "requester",
            "location",
            "invoice_location",
            "memory",
        ).get(asset_uuid=asset_uuid)

        old_asset_data = {
            "asset_type": (
                asset.asset_type.asset_type_name if asset.asset_type else None
            ),
            "business_unit": (
                asset.business_unit.business_unit_name if asset.business_unit else None
            ),
            "custodian": asset.custodian.employee_name if asset.custodian else None,
            "approved_by": asset.approved_by.username if asset.approved_by else None,
            "requester": asset.requester.username if asset.requester else None,
            "location": asset.location.location_name if asset.location else None,
            "invoice_location": (
                asset.invoice_location.location_name if asset.invoice_location else None
            ),
            "memory": asset.memory.memory_space if asset.memory else None,
            "asset_category": asset.asset_category,
            "product_name": asset.product_name,
            "model_number": asset.model_number,
            "serial_number": asset.serial_number,
            "owner": asset.owner,
            "date_of_purchase": asset.date_of_purchase,
            "status": asset.status,
            "warranty_period": asset.warranty_period,
            "os": asset.os,
            "os_version": asset.os_version,
            "mobile_os": asset.mobile_os,
            "processor": asset.processor,
            "processor_gen": asset.processor_gen,
            "storage": asset.storage,
            "configuration": asset.configuration,
            "accessories": asset.accessories,
            "notes": asset.notes,
            "asset_detail_status": asset.asset_detail_status,
            "assign_status": asset.assign_status,
            "approval_status_message": asset.approval_status_message,
            "is_deleted": asset.is_deleted,
        }

        return asset, old_asset_data

    def _get_new_asset_data(self, asset):
        return {
            "asset_type": (
                asset.asset_type.asset_type_name if asset.asset_type else None
            ),
            "business_unit": (
                asset.business_unit.business_unit_name if asset.business_unit else None
            ),
            "custodian": asset.custodian.employee_name if asset.custodian else None,
            "approved_by": asset.approved_by.username if asset.approved_by else None,
            "requester": asset.requester.username if asset.requester else None,
            "location": asset.location.location_name if asset.location else None,
            "invoice_location": (
                asset.invoice_location.location_name if asset.invoice_location else None
            ),
            "memory": asset.memory.memory_space if asset.memory else None,
            "asset_category": asset.asset_category,
            "product_name": asset.product_name,
            "model_number": asset.model_number,
            "serial_number": asset.serial_number,
            "owner": asset.owner,
            "date_of_purchase": asset.date_of_purchase,
            "status": asset.status,
            "warranty_period": asset.warranty_period,
            "os": asset.os,
            "os_version": asset.os_version,
            "mobile_os": asset.mobile_os,
            "processor": asset.processor,
            "processor_gen": asset.processor_gen,
            "storage": asset.storage,
            "configuration": asset.configuration,
            "accessories": asset.accessories,
            "notes": asset.notes,
            "asset_detail_status": asset.asset_detail_status,
            "assign_status": asset.assign_status,
            "approval_status_message": asset.approval_status_message,
            "is_deleted": asset.is_deleted,
        }

    def _get_changed_fields(self, old_data, new_data):
        excluded_fields = {
            "created_at",
            "updated_at",
            "asset_uuid",
            "asset_detail_status",
        }
        changed_fields = []

        for field in new_data:
            if field in excluded_fields:
                continue
            old_value = old_data.get(field)
            new_value = new_data.get(field)
            if old_value != new_value:
                changed_fields.append((field, old_value, new_value))

        return changed_fields
