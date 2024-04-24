from ai.service.database_service.database_table_list_generator import (
    DatabaseTableListGenerator,
)
from ai.service.database_service.database_table_schema_retriever import (
    DatabaseTableSchemaRetriever,
)
from ai.service.database_service.database_sql_executor import DatabaseSqlExecutor


class AiChatWithDatabaseService:

    def __init__(self, ai_client):
        self.ai_client = ai_client
        self.database_table_list_generator = DatabaseTableListGenerator()
        self.database_table_schema_retriever = DatabaseTableSchemaRetriever()
        self.database_sql_executor = DatabaseSqlExecutor()

    def chat_with_database(self, prompt):
        response = self.ai_client.generate_response(prompt)

        function_calling_in_process = True
        while function_calling_in_process:
            try:
                params = {}
                for key, value in response.function_call.args.items():
                    params[key] = value

                print("Function call name: ", response.function_call.name)
                print("Params: ", params)

                if response.function_call.name == "list_tables":
                    api_response = self.database_table_list_generator.generate_list()

                if response.function_call.name == "get_table_schema":
                    api_response = self.database_table_schema_retriever.retrieve_schema(
                        params["table_name"]
                    )

                if response.function_call.name == "sql_query":
                    api_response = self.database_sql_executor.execute_sql(
                        params["query"]
                    )

                response = self.ai_client.generate_response(api_response, response.function_call.name)

            except AttributeError:
                function_calling_in_process = False
                self.ai_client.reset_chat()

        return response
