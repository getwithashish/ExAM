import uuid
from django.conf import settings
from django.core.management.base import BaseCommand

from asset.models import AssetType, Location, BusinessUnit, Memory, Asset
from employee.models.employee import Employee
from user_auth.models import User
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = "Creates a dummy Asset with all necessary foreign key instances"

    def handle(self, *args, **kwargs):
        global_config = settings.GLOBAL_CONFIG

        # Helper method to create or get an instance
        def get_or_create_instance(model, **kwargs):
            instance, created = model.objects.get_or_create(**kwargs)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created new {model.__name__}: {instance}")
                )
            return instance

        # Create dummy data for foreign keys
        asset_type = get_or_create_instance(
            AssetType, asset_type_name=global_config["dummy_data"]["asset_type"]
        )
        custodian = get_or_create_instance(
            Employee,
            employee_name=global_config["dummy_data"]["custodian"]["name"],
            employee_department=global_config["dummy_data"]["custodian"]["department"],
            employee_designation=global_config["dummy_data"]["custodian"][
                "designation"
            ],
        )
        location = get_or_create_instance(
            Location, location_name=global_config["dummy_data"]["location"]
        )
        business_unit = get_or_create_instance(
            BusinessUnit,
            business_unit_name=global_config["dummy_data"]["business_unit"],
        )
        memory = get_or_create_instance(
            Memory, memory_space=global_config["dummy_data"]["memory"]
        )
        approved_by = get_or_create_instance(
            User,
            username=global_config["dummy_data"]["user"]["lead"]["username"],
            password=global_config["dummy_data"]["user"]["lead"]["password"],
            defaults={
                "email": global_config["dummy_data"]["user"]["lead"]["email"],
                "user_scope": global_config["dummy_data"]["user"]["lead"]["user_scope"],
            },
        )
        requester = get_or_create_instance(
            User,
            username=global_config["dummy_data"]["user"]["system_admin"]["username"],
            password=global_config["dummy_data"]["user"]["system_admin"]["password"],
            defaults={
                "email": global_config["dummy_data"]["user"]["system_admin"]["email"],
                "user_scope": global_config["dummy_data"]["user"]["system_admin"][
                    "user_scope"
                ],
            },
        )

        # Create the dummy asset
        try:
            existing_dummy_asset = Asset.objects.get(
                asset_id=global_config["dummy_data"]["asset_id"]
            )
            self.stdout.write(
                self.style.WARNING(
                    f"Dummy Asset already exists: {existing_dummy_asset}"
                )
            )

        except Asset.DoesNotExist:
            dummy_asset = Asset.objects.get_or_create(
                asset_id=global_config["dummy_data"]["asset_id"][0],
                asset_category=global_config["dummy_data"]["asset_category"],
                asset_type=asset_type,
                product_name=global_config["dummy_data"]["product_name"],
                model_number=global_config["dummy_data"]["model_number"],
                serial_number=str(uuid.uuid4()),
                owner=global_config["dummy_data"]["owner"],
                custodian=custodian,
                date_of_purchase=datetime.now() - timedelta(days=365),
                status=global_config["dummy_data"]["status"],
                warranty_period=24,
                location=location,
                invoice_location=location,
                business_unit=business_unit,
                memory=memory,
                license_type=global_config["dummy_data"]["license_type"][0],
                approved_by=approved_by,
                requester=requester,
                is_deleted=True,
            )

            dummy_asset = Asset.objects.get_or_create(
                asset_id=global_config["dummy_data"]["asset_id"][1],
                asset_category=global_config["dummy_data"]["asset_category"],
                asset_type=asset_type,
                product_name=global_config["dummy_data"]["product_name"],
                model_number=global_config["dummy_data"]["model_number"],
                serial_number=str(uuid.uuid4()),
                owner=global_config["dummy_data"]["owner"],
                custodian=custodian,
                date_of_purchase=datetime.now() - timedelta(days=365),
                status=global_config["dummy_data"]["status"],
                warranty_period=24,
                location=location,
                invoice_location=location,
                business_unit=business_unit,
                memory=memory,
                license_type=global_config["dummy_data"]["license_type"][1],
                approved_by=approved_by,
                requester=requester,
                is_deleted=True,
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Dummy Asset created and then deleted: {dummy_asset}"
                )
            )

        except Exception:
            self.style.WARNING("Some Error Occured")
