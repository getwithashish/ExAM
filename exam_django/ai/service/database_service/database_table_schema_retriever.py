from django.db import connection


class DatabaseTableSchemaRetriever:

    def retrieve_schema(self, table_name):
        with connection.cursor() as cursor:
            table_description = connection.introspection.get_table_description(
                cursor, table_name
            )

        return table_description

    table_schema_retriever_description = {
        "function_declarations": [
            {
                "name": "get_table_schema",
                "description": "This will give the schema of a table that will help answer the user's question",
                "parameters": {
                    "type_": "OBJECT",
                    "properties": {"table_name": {"type_": "STRING"}},
                    "required": ["table_name"],
                },
            }
        ]
    }
