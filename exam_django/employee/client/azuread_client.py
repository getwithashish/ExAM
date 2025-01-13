from azure.identity import ClientSecretCredential
from django.conf import settings
from msgraph import GraphServiceClient

from employee.client.employee_data_source_client_abstract import (
    EmployeeDataSourceClientAbstract,
)


global_config = settings.GLOBAL_CONFIG


class AzureAD_Client(EmployeeDataSourceClientAbstract):

    credentials = ClientSecretCredential(tenant_id=, client_id=, client_secret=)
    scopes = global_config["employee"]["scopes"]

    client = GraphServiceClient(credentials=credentials, scopes=scopes)

    @staticmethod
    async def retrieve_users():
       users = await AzureAD_Client.client.users.get()
