from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from ai.service.database_service.database_table_list_generator import (
    DatabaseTableListGenerator,
)
from ai.service.database_service.database_table_schema_retriever import (
    DatabaseTableSchemaRetriever,
)
from ai.service.database_service.database_sql_executor import DatabaseSqlExecutor
from ai.clients.gemini_client.gemini_client import GeminiClient
from ai.service.ai_chat_with_database_service import AiChatWithDatabaseService
from response import APIResponse


class AiChatWithDbView(GenericAPIView):

    permission_classes = [AllowAny]

    def post(self, request):
        # Pass Gemini from here

        # tables = DatabaseTableListGenerator().perform_operation()
        # print(tables)

        # table_schema = DatabaseTableSchemaRetriever().perform_operation("asset_asset")
        # print(table_schema)

        # for column in table_schema:
        #     print(column)

        # sql_response = DatabaseSqlExecutor().execute_sql("SELECT * from asset_location")
        # print(sql_response)

        prompt = request.data.get("prompt")

        gemini_client = GeminiClient()
        ai_chat_with_database_service = AiChatWithDatabaseService(gemini_client)
        ai_response = ai_chat_with_database_service.chat_with_database(prompt)
        print("AI Response: ", ai_response)

        return APIResponse(f"msg: {ai_response}", status=status.HTTP_200_OK)
