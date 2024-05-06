from django.db import connection


class DatabaseTableListGenerator:

    def generate_list(self):
        excluded_tables = [
            "django_migrations",
            "django_session",
            "auth_user",
            "auth_group",
            "auth_permission",
            "auth_user_groups",
            "auth_user_user_permissions",
            "django_admin_log",
            "django_content_type",
            "auth_group_permissions",
            "django_rest_passwordreset_resetpasswordtoken",
            "user_auth_user_groups",
            "user_auth_user_user_permissions",
        ]

        with connection.cursor() as cursor:
            all_tables = connection.introspection.table_names(cursor)
            custom_tables = [
                table for table in all_tables if table not in excluded_tables
            ]
        return custom_tables

    table_list_generator_description = {
        "function_declarations": [
            {
                "name": "list_tables",
                "description": "This will list the tables that will help answer the user's question",
                "parameters": {
                    "type": "object",
                    "properties": {},
                },
            }
        ]
    }
