from typing import Dict, List, Optional
from azure.identity import ClientSecretCredential
from django.conf import settings
from msgraph import GraphServiceClient
from msgraph.generated.users.item.messages.messages_request_builder import (
    MessagesRequestBuilder,
)
from msgraph.generated.users.users_request_builder import UsersRequestBuilder


from employee.client.employee_data_source_client_abstract import (
    EmployeeDataSourceClientAbstract,
)
from employee.client.azuread.azuread_config import (
    AZUREAD_TENANT_ID,
    CLIENT_ID,
    CLIENT_SECRET,
)
from employee.models.employee import Employee
from employee.service.employee_service import EmployeeService


global_config = settings.GLOBAL_CONFIG


class AzureAD_Client(EmployeeDataSourceClientAbstract):

    credentials = ClientSecretCredential(
        tenant_id=AZUREAD_TENANT_ID,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
    )
    scopes: List = global_config["employee"]["scopes"]

    client = GraphServiceClient(credentials=credentials, scopes=scopes)

    @staticmethod
    async def retrieve_users(user_emails: Optional[List[str]] = None):
        azure_employees: List = []
        next_data_link: str = None
        delta_metadata: Dict = None

        query_params = UsersRequestBuilder.UsersRequestBuilderGetQueryParameters(
            count=True,
            select=[
                "displayName",
                "employeeId",
                "id",
                "mail",
                "mobilePhone",
                "department",
                "jobTitle",
                "officeLocation",
                "accountEnabled",
            ],
        )
        request_config = UsersRequestBuilder.UsersRequestBuilderGetRequestConfiguration(
            query_parameters=query_params
        )

        # Looping through pages until all users are obtained
        while True:
            if next_data_link is None:
                users_collection_response = await AzureAD_Client.client.users.delta.get(
                    request_configuration=request_config
                )
            else:
                users_collection_response = (
                    await AzureAD_Client.client.users.delta.with_url(
                        next_data_link
                    ).get()
                )

            users = users_collection_response.value
            next_data_link = users_collection_response.odata_next_link

            if users is not None:
                azure_employees = AzureAD_Client.construct_employees(users=users)
                yield (azure_employees, delta_metadata)

            if next_data_link is None:
                azure_employees = []
                delta_metadata = AzureAD_Client.generate_delta_metadata(
                    delta_link=users_collection_response.odata_delta_link
                )

                yield (azure_employees, delta_metadata)
                break

    @staticmethod
    async def get_user_count():
        request_config = (
            MessagesRequestBuilder.MessagesRequestBuilderGetRequestConfiguration()
        )
        request_config.headers.add("ConsistencyLevel", "eventual")

        user_count = await AzureAD_Client.client.users.count.get(
            request_configuration=request_config
        )

        return user_count

    @staticmethod
    async def get_user_changes(delta_metadata: Dict):
        deleted_azure_employees: List = []
        created_or_updated_azure_employees: List = []
        next_data_link: str = None
        delta_data_link: str = delta_metadata.get("delta_link")

        delta_metadata_dict: Dict = None

        # Looping through pages until all users are obtained
        while True:
            users_collection_response = (
                await AzureAD_Client.client.users.delta.with_url(
                    next_data_link if next_data_link else delta_data_link
                ).get()
            )

            users = users_collection_response.value
            next_data_link = users_collection_response.odata_next_link

            if users is not None:
                deleted_azure_employees, created_or_updated_azure_employees = (
                    AzureAD_Client.construct_delta_employees(users=users)
                )

                yield (
                    deleted_azure_employees,
                    created_or_updated_azure_employees,
                    delta_metadata_dict,
                )

            if next_data_link is None:
                deleted_azure_employees = []
                created_or_updated_azure_employees = []
                delta_metadata_dict = AzureAD_Client.generate_delta_metadata(
                    delta_link=users_collection_response.odata_delta_link
                )

                yield (
                    deleted_azure_employees,
                    created_or_updated_azure_employees,
                    delta_metadata_dict,
                )
                break

    @staticmethod
    def construct_employees(users: List):
        employees: List = []

        for user in users:
            employee = Employee(
                employee_name=user.display_name,
                employee_id=user.employee_id,
                object_id=user.id,
                email=user.mail,
                mobile_phone=user.mobile_phone,
                employee_department=user.department,
                employee_designation=user.job_title,
                office_location=user.office_location,
                is_enabled=user.account_enabled,
            )
            employees.append(employee)

        return employees

    @staticmethod
    def construct_delta_employees(users: List):
        deleted_object_ids: List = []
        created_or_updated_object_ids: List = []

        for user in users:
            if "@removed" in user:
                deleted_object_ids.append(user.id)
            else:
                created_or_updated_object_ids.append(user.id)

        deleted_employees = EmployeeService.get_employees_by_object_id_async(
            employee_object_ids=deleted_object_ids
        )
        created_or_updated_employees = EmployeeService.get_employees_by_object_id_async(
            employee_object_ids=created_or_updated_object_ids
        )

        return (deleted_employees, created_or_updated_employees)

    @staticmethod
    def generate_delta_metadata(delta_link: str):
        delta_metadata = {"delta_link": delta_link}
        return delta_metadata
