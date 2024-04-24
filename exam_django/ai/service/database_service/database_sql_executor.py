from django.db import connection


class DatabaseSqlExecutor:

    def execute_sql(self, query, params=None):
        print("SQL query executed: ", query)

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            results = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]

        print(results)
        # return results, column_names
        # for row in results:
        #     print(dict(zip(column_names, row)))

        return results

    sql_executor_description = {
        "function_declarations": [
            {
                "name": "sql_query",
                "description": "Get information from data in Postgresql using SQL queries",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "SQL query on a single line that will help give quantitative answers to the user's question when run on a MySQL database and table. In the SQL query, always use the fully qualified table names.",
                        }
                    },
                    "required": [
                        "query",
                    ],
                },
            }
        ]
    }
