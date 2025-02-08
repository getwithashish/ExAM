import json
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from asset.service.asset_crud_service.asset_query_abstract import AssetQueryAbstract
from asset.serializers.asset_serializer import AssetReadSerializer
from asset.service.asset_crud_service.asset_normal_query_service import (
    AssetNormalQueryService,
)
from messages import ASSET_LIST_SUCCESSFULLY_RETRIEVED, UNSUPPORTED_OPERATION


class AssetAdvancedQueryServiceWithJsonLogic(AssetQueryAbstract):
    """
    Service class for advanced querying of assets using JsonLogic expressions.
    """

    def get_asset_details(self, serializer: AssetReadSerializer, request) -> tuple:
        """
        Retrieve asset details based on a JsonLogic query and paginate the results.

        Args:
            serializer (AssetReadSerializer): The serializer for asset representation.
            request: The HTTP request object containing query parameters.

        Returns:
            tuple: A tuple containing paginated asset data, success message, and HTTP status code.
        """
        self.pagination = LimitOffsetPagination()

        json_logic = request.query_params.get("json_logic")
        logic_data = json.loads(json_logic)

        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")
        if limit:
            self.pagination.default_limit = int(limit)
        if offset:
            self.pagination.default_offset = int(offset)

        q_objects = self.convert_json_logic_to_django_q(logic_data)

        asset_normal_query_service = AssetNormalQueryService()

        queryset = asset_normal_query_service.filter_queryset(request=request)
        queryset = queryset.filter(q_objects)

        page = self.pagination.paginate_queryset(queryset, request)
        if page is not None:
            serializer = AssetReadSerializer(page, many=True)
            paginated_data = self.pagination.get_paginated_response(serializer.data)
            return (
                paginated_data.data,
                ASSET_LIST_SUCCESSFULLY_RETRIEVED,
                status.HTTP_200_OK,
            )

        serializer = AssetReadSerializer(queryset, many=True)
        return serializer.data, ASSET_LIST_SUCCESSFULLY_RETRIEVED, status.HTTP_200_OK

    # Recursively convert JsonLogic expression to Django Q objects
    def convert_json_logic_to_django_q(self, logic_data: dict) -> Q:
        """
        Convert a JsonLogic expression to Django Q objects.

        Args:
            logic_data (dict): The JsonLogic expression as a dictionary.

        Returns:
            Q: A Django Q object representing the query.
        
        Raises:
            ValueError: If the JsonLogic expression is unsupported.
        """

        if "and" in logic_data:
            combined_q = Q()
            for item in logic_data["and"]:
                combined_q &= self.convert_json_logic_to_django_q(item)
            return combined_q

        elif "or" in logic_data:
            combined_q = Q()
            for item in logic_data["or"]:
                combined_q |= self.convert_json_logic_to_django_q(item)
            return combined_q

        elif "==" in logic_data:
            field = logic_data["=="][0]["var"]
            value = logic_data["=="][1]
            # Checked for null
            return Q(**{field: value if value != "null" else None})

        elif "!=" in logic_data:
            field = logic_data["!="][0]["var"]
            value = logic_data["!="][1]
            return ~Q(**{field: value})

        elif "in" in logic_data and isinstance(logic_data["in"][1], list):
            input_list = logic_data["in"]
            dictionary_variable = None
            other_strings_array = []
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    if isinstance(item, str):
                        other_strings_array.append(item)
                    elif isinstance(item, list):
                        for element in item:
                            other_strings_array.append(element)
            field = dictionary_variable["var"]
            values = other_strings_array
            return Q(**{field + "__in": values})

        elif (
            "!" in logic_data
            and "in" in logic_data["!"]
            and isinstance(logic_data["!"]["in"][1], list)
        ):
            input_list = logic_data["!"]["in"]
            dictionary_variable = None
            other_strings_array = []
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    if isinstance(item, str):
                        other_strings_array.append(item)
                    elif isinstance(item, list):
                        for element in item:
                            other_strings_array.append(element)
            field = dictionary_variable["var"]
            values = other_strings_array
            return ~Q(**{field + "__in": values})

        elif ">" in logic_data:
            field = logic_data[">"][0]["var"]
            value = logic_data[">"][1]
            return Q(**{field + "__gt": value})

        elif "<" in logic_data:
            field = logic_data["<"][0]["var"]
            value = logic_data["<"][1]

            return Q(**{field + "__lt": value})

        elif "<=" in logic_data and len(logic_data["<="]) == 2:
            field = logic_data["<="][0]["var"]
            value = logic_data["<="][1]
            return Q(**{field + "__lte": value})

        elif ">=" in logic_data and len(logic_data[">="]) == 2:
            field = logic_data[">="][0]["var"]
            value = logic_data[">="][1]
            return Q(**{field + "__gte": value})

        elif "in" in logic_data:
            field = logic_data["in"][1]["var"]
            value = logic_data["in"][0]
            return Q(**{field + "__icontains": value})

        elif "!" in logic_data and "in" in logic_data["!"]:
            field = logic_data["!"]["in"][1]["var"]
            value = logic_data["!"]["in"][0]
            return ~Q(**{field + "__icontains": value})

        elif "startsWith" in logic_data:
            field = logic_data["startsWith"][0]["var"]
            value = logic_data["startsWith"][1]
            return Q(**{field + "__istartswith": value})

        elif "!" in logic_data and "startsWith" in logic_data["!"]:
            input_list = logic_data["!"]["startsWith"]
            dictionary_variable = None
            value = ""
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    value = item
            field = dictionary_variable["var"]
            return ~Q(**{field + "__istartswith": value})

        elif "endsWith" in logic_data:
            field = logic_data["endsWith"][0]["var"]
            value = logic_data["endsWith"][1]
            return Q(**{field + "__iendswith": value})

        elif "!" in logic_data and "endsWith" in logic_data["!"]:
            input_list = logic_data["!"]["endsWith"]
            dictionary_variable = None
            value = ""
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    value = item
            field = dictionary_variable["var"]
            return ~Q(**{field + "__iendswith": value})

        elif "<=" in logic_data:
            input_list = logic_data["<="]
            dictionary_variable = None
            values = []
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    values.append(item)
            field = dictionary_variable["var"]
            return Q(**{field + "__range": (values[0], values[1])})

        elif "!" in logic_data and "<=" in logic_data["!"]:
            input_list = logic_data["!"]["<="]
            dictionary_variable = None
            values = []
            for item in input_list:
                if isinstance(item, dict):
                    dictionary_variable = item
                else:
                    values.append(item)
            field = dictionary_variable["var"]
            return ~Q(**{field + "__range": (values[0], values[1])})

        else:
            raise ValueError(UNSUPPORTED_OPERATION)
