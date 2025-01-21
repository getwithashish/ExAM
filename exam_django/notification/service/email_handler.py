from collections.abc import Callable
from typing import Dict, List, Optional
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
from django.conf import settings
import sentry_sdk

from asset.models.asset import Asset
from user_auth.service.user_service.django_user_service.django_user_query_service import (
    DjangoUserQueryService,
)
from notification.models import EmailNotification, Notification
from exceptions import NotFoundException
from notification.client.django_email_client import django_email_client
from notification.service.notification_handler_abstract import (
    NotificationHandlerAbstract,
)
from notification.utils.email_body_contents.lead_email_body_contents import (
    construct_allocate_asset_email_body_content,
    construct_create_asset_email_body_content,
    construct_deallocate_asset_email_body_content,
    construct_modify_asset_email_body_content,
)
from notification.utils.email_body_contents.system_admin_email_body_contents import (
    construct_allocation_approval_email_body,
    construct_allocation_rejection_email_body,
    construct_creation_approval_email_body,
    construct_creation_rejection_email_body,
    construct_custodian_deleted_email_body,
    construct_deallocation_approval_email_body,
    construct_deallocation_rejection_email_body,
    construct_modification_approval_email_body,
    construct_modification_rejection_email_body,
)
from notification.utils.email_body_contents.employee_email_body_contents import (
    construct_allocation_approval_employee_email_body,
    construct_deallocation_approval_employee_email_body,
)
from messages import (
    ASSET_ASSIGNING_PENDING,
    ASSET_CREATE_PENDING_SUCCESSFUL,
    ASSET_CREATION_REJECTED,
    ASSET_SUCCESSFULLY_ASSIGNED,
    ASSET_SUCCESSFULLY_CREATED,
    ASSET_SUCCESSFULLY_UNASSIGNED,
    ASSET_SUCCESSFULLY_UPDATED,
    ASSET_UNASSIGNING_PENDING,
    ASSET_UPDATE_PENDING_SUCCESSFUL,
    ASSET_UPDATION_REJECTED,
    ASSIGN_ASSET_REJECT_SUCCESSFUL,
    CUSTODIAN_EMPLOYEE_DELETED,
    EMAIL_MESSAGE_ID_NOT_FOUND,
    EMPLOYEE_ASSIGNED_SUCESSFULLY,
    EMPLOYEE_UNASSIGNED_SUCESSFULLY,
    UNASSIGN_ASSET_REJECT_SUCCESSFUL,
)


global_config = settings.GLOBAL_CONFIG


class EmailHandler(NotificationHandlerAbstract):

    @staticmethod
    @shared_task(bind=True, max_retries=3, default_retry_delay=60)
    def send_notification(
        self,
        notification_id: str,
        subject: str,
        message: str,
        email_body: Optional[str] = None,
        is_part_of_request_flow: bool = True,
        to_recipient_list: Optional[List] = None,
        cc_recipient_list: Optional[List] = None,
        **kwargs
    ):
        try:
            follow_up_id = None
            email_client = django_email_client

            current_notification = Notification.objects.get(id=notification_id)

            if is_part_of_request_flow:
                immediate_previous_notification = (
                    Notification.objects.filter(asset_uuid=kwargs["asset_uuid"])
                    .order_by("-created_at")[1:2]
                    .first()
                )

                if (
                    immediate_previous_notification
                    and immediate_previous_notification.email_status
                    in ["EMAIL_NOT_SENT", "EMAIL_SENDING"]
                ):
                    self.apply_async(
                        notification_id=notification_id,
                        subject=subject,
                        message=message,
                        email_body=email_body,
                        is_part_of_request_flow=is_part_of_request_flow,
                        to_recipient_list=to_recipient_list,
                        cc_recipient_list=cc_recipient_list,
                        kwargs=kwargs,
                        countdown=60,
                    )
                    return

                # (
                #     to_recipient_list,
                #     cc_recipient_list,
                #     bcc_recipient_list,
                #     subject,
                #     email_body,
                # ) = EmailHandler.construct_email(
                #     subject=subject, message=message, **kwargs
                # )

                follow_up_id = EmailHandler.get_follow_up_id(
                    asset_uuid_str=kwargs["asset_uuid"], message=message, **kwargs
                )

            (
                to_recipient_list,
                cc_recipient_list,
                bcc_recipient_list,
                subject,
                email_body,
            ) = EmailHandler.construct_email(subject=subject, message=message, **kwargs)

            current_notification.email_status = "EMAIL_SENDING"
            current_notification.save()

            message_id = email_client.send_email(
                to_recipient_list=to_recipient_list,
                cc_recipient_list=cc_recipient_list,
                bcc_recipient_list=bcc_recipient_list,
                subject=subject,
                body=email_body,
                follow_up_id=follow_up_id,
            )

            if not message_id:
                raise NotFoundException(
                    {}, message=EMAIL_MESSAGE_ID_NOT_FOUND, status=None
                )

            current_notification.email_status = "EMAIL_SENT"
            current_notification.save()

            current_email_notification = EmailNotification(
                notification_id=current_notification, message_id=message_id
            )
            current_email_notification.save()

        except MaxRetriesExceededError:
            current_notification.email_status = "EMAIL_SENDING_FAILED"
            current_notification.save()

        except NotFoundException:
            raise self.retry()

        except Exception as e:
            sentry_sdk.capture_exception(e)
            raise self.retry()

    @staticmethod
    def get_recipient_addresses(user_scope: Optional[str]) -> Optional[List[str]]:
        if (
            user_scope
            in global_config["model_data"]["user"]["application"]["user_scopes"]
        ):
            user_serializer = DjangoUserQueryService.get_user_data(
                user_scope=user_scope
            )
            users = user_serializer.data
            recipient_addresses = [user.get("email") for user in users]

            return recipient_addresses

        return None

    @staticmethod
    def get_follow_up_id(asset_uuid_str: str, message: str, **kwargs) -> Optional[str]:
        follow_up_id = None

        if message in (EMPLOYEE_ASSIGNED_SUCESSFULLY, EMPLOYEE_UNASSIGNED_SUCESSFULLY):
            return follow_up_id

        if message in (
            ASSET_CREATE_PENDING_SUCCESSFUL,
            ASSET_UPDATE_PENDING_SUCCESSFUL,
            ASSET_ASSIGNING_PENDING,
            ASSET_UNASSIGNING_PENDING,
        ):
            previous_asset_data = kwargs["old_asset_data"]

            if not previous_asset_data:
                return follow_up_id

            asset_detail_status = previous_asset_data["asset_detail_status"]
            assign_status = previous_asset_data["assign_status"]

            if (
                asset_detail_status
                not in [
                    "CREATE_REJECTED",
                    "UPDATE_REJECTED",
                ]
                or assign_status != "REJECTED"
            ):
                return follow_up_id

        try:
            latest_email_notification = (
                EmailNotification.objects.filter(
                    notification_id__asset_uuid=asset_uuid_str
                )
                .order_by("-created_at")
                .first()
            )

            return (
                latest_email_notification.message_id
                if latest_email_notification
                else None
            )

        except (
            Asset.DoesNotExist,
            Notification.DoesNotExist,
            EmailNotification.DoesNotExist,
        ):
            return None

    @staticmethod
    def construct_email(subject: str, message: str, **kwargs) -> str:

        email_construction: Dict[str, Callable[[], None]] = {
            ASSET_CREATE_PENDING_SUCCESSFUL: (
                EmailHandler.construct_request_email,
                construct_create_asset_email_body_content,
            ),
            ASSET_UPDATE_PENDING_SUCCESSFUL: (
                EmailHandler.construct_request_email,
                construct_modify_asset_email_body_content,
            ),
            ASSET_ASSIGNING_PENDING: (
                EmailHandler.construct_request_email,
                construct_allocate_asset_email_body_content,
            ),
            ASSET_UNASSIGNING_PENDING: (
                EmailHandler.construct_request_email,
                construct_deallocate_asset_email_body_content,
            ),
            ASSET_SUCCESSFULLY_CREATED: (
                EmailHandler.construct_acknowledge_email,
                construct_creation_approval_email_body,
            ),
            ASSET_CREATION_REJECTED: (
                EmailHandler.construct_acknowledge_email,
                construct_creation_rejection_email_body,
            ),
            ASSET_SUCCESSFULLY_UPDATED: (
                EmailHandler.construct_acknowledge_email,
                construct_modification_approval_email_body,
            ),
            ASSET_UPDATION_REJECTED: (
                EmailHandler.construct_acknowledge_email,
                construct_modification_rejection_email_body,
            ),
            ASSET_SUCCESSFULLY_ASSIGNED: (
                EmailHandler.construct_acknowledge_email,
                construct_allocation_approval_email_body,
            ),
            ASSIGN_ASSET_REJECT_SUCCESSFUL: (
                EmailHandler.construct_acknowledge_email,
                construct_allocation_rejection_email_body,
            ),
            ASSET_SUCCESSFULLY_UNASSIGNED: (
                EmailHandler.construct_acknowledge_email,
                construct_deallocation_approval_email_body,
            ),
            UNASSIGN_ASSET_REJECT_SUCCESSFUL: (
                EmailHandler.construct_acknowledge_email,
                construct_deallocation_rejection_email_body,
            ),
            EMPLOYEE_ASSIGNED_SUCESSFULLY: (
                EmailHandler.construct_employee_email,
                construct_allocation_approval_employee_email_body,
            ),
            EMPLOYEE_UNASSIGNED_SUCESSFULLY: (
                EmailHandler.construct_employee_email,
                construct_deallocation_approval_employee_email_body,
            ),
            CUSTODIAN_EMPLOYEE_DELETED: (
                EmailHandler.construct_sysadmin_info_email,
                construct_custodian_deleted_email_body,
            ),
        }

        email_constructor, email_body_constructor = email_construction.get(message)

        (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        ) = email_constructor(subject, email_body_constructor, **kwargs)

        return (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        )

    @staticmethod
    def construct_request_email(subject: str, email_body_construction_func, **kwargs):
        to_recipient_list = []
        cc_recipient_list = []
        bcc_recipient_list = []
        subject = subject

        email_body = email_body_construction_func(**kwargs)
        # TODO to_recipient_list - all leads - bcc this
        bcc_recipient_list = EmailHandler.get_recipient_addresses(user_scope="LEAD")
        cc_recipient_list.append(kwargs["requester"]["email"])

        return (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        )

    @staticmethod
    def construct_acknowledge_email(
        subject: str, email_body_construction_func, **kwargs
    ):
        to_recipient_list = []
        cc_recipient_list = []
        bcc_recipient_list = []
        subject = subject

        email_body = email_body_construction_func(**kwargs)
        to_recipient_list.append(kwargs["requester"]["email"])
        cc_recipient_list.append(kwargs["approved_by"]["email"])

        return (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        )

    @staticmethod
    def construct_employee_email(subject: str, email_body_construction_func, **kwargs):
        to_recipient_list = []
        cc_recipient_list = []
        bcc_recipient_list = []
        subject = subject

        email_body = email_body_construction_func(**kwargs)
        to_recipient_list.append(kwargs["custodian"]["email"])
        # bcc_recipient_list.append(kwargs["requester"]["email"])
        # bcc_recipient_list.append(kwargs["approved_by"]["email"])

        return (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        )

    @staticmethod
    def construct_sysadmin_info_email(
        subject: str, email_body_construction_func, **kwargs
    ):
        to_recipient_list = []
        cc_recipient_list = []
        bcc_recipient_list = []
        subject = subject

        email_body = email_body_construction_func(**kwargs)
        bcc_recipient_list = EmailHandler.get_recipient_addresses(
            user_scope="SYSTEM_ADMIN"
        )

        return (
            to_recipient_list,
            cc_recipient_list,
            bcc_recipient_list,
            subject,
            email_body,
        )
