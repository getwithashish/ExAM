import json
from django.db.models import Q
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination

from asset.service.asset_crud_service.asset_query_abstract import AssetQueryAbstract
from asset.models.asset import Asset
from asset.serializers.asset_serializer import AssetReadSerializer
from messages import ASSET_LIST_SUCCESSFULLY_RETRIEVED


class AssetAdvancedQueryServiceWithJsonLogic(AssetQueryAbstract):

    def get_asset_details(self, serializer, request):
        self.pagination = LimitOffsetPagination()
        json_logic = request.query_params.get("json_logic")
        logic_data = json.loads(json_logic)
        print("After json.loads: ", logic_data)

        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")
        if limit:
            self.pagination.default_limit = limit
        if offset:
            self.pagination.default_offset = offset

        # Convert JsonLogic expression to Django Q objects
        q_objects = self.convert_json_logic_to_django_q(logic_data)

        queryset = Asset.objects.all()
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

    def convert_json_logic_to_django_q(self, logic_data):
        # Recursively convert JsonLogic expression to Django Q objects
        if "and" in logic_data:
            return Q(
                *[
                    self.convert_json_logic_to_django_q(item)
                    for item in logic_data["and"]
                ]
            )
        elif "or" in logic_data:
            return Q(
                *[
                    self.convert_json_logic_to_django_q(item)
                    for item in logic_data["or"]
                ]
            )

        # "equals" operation
        elif "==" in logic_data:
            field = logic_data["=="][0]["var"]
            value = logic_data["=="][1]
            return Q(**{field: value})

        # "not equals" operation
        elif "!=" in logic_data:
            field = logic_data["!="][0]["var"]
            value = logic_data["!="][1]
            return ~Q(**{field: value})

        # "in" operation
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

        # "not in" operation
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

        # "Greater than" operation
        elif ">" in logic_data:
            field = logic_data[">"][0]["var"]
            value = logic_data[">"][1]
            return Q(**{field + "__gt": value})

        # "Less than" operation
        elif "<" in logic_data:
            field = logic_data["<"][0]["var"]
            value = logic_data["<"][1]
            print("NOT IN: Field: ", field, " Value: ", value)

            return Q(**{field + "__lt": value})

        # "Less than or equal to" operation
        elif "<=" in logic_data and len(logic_data["<="]) == 2:
            field = logic_data["<="][0]["var"]
            value = logic_data["<="][1]
            return Q(**{field + "__lte": value})

        # "Greater than or equal to" operation
        elif ">=" in logic_data and len(logic_data[">="]) == 2:
            field = logic_data[">="][0]["var"]
            value = logic_data[">="][1]
            return Q(**{field + "__gte": value})

        # "Contains" operation
        elif "in" in logic_data:
            field = logic_data["in"][1]["var"]
            value = logic_data["in"][0]
            return Q(**{field + "__icontains": value})

        # "Does not contain" operation
        elif "!" in logic_data and "in" in logic_data["!"]:
            field = logic_data["!"]["in"][1]["var"]
            value = logic_data["!"]["in"][0]
            return ~Q(**{field + "__icontains": value})

        # "Begins with" operation
        elif "startsWith" in logic_data:
            field = logic_data["startsWith"][0]["var"]
            value = logic_data["startsWith"][1]
            return Q(**{field + "__istartswith": value})

        # "Does not begin with" operation
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

        # "Ends with" operation
        elif "endsWith" in logic_data:
            field = logic_data["endsWith"][0]["var"]
            value = logic_data["endsWith"][1]
            return Q(**{field + "__iendswith": value})

        # "Does not end with" operation
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

        # "Between" operation
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

        # "Not Between" operation
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
            raise ValueError("Unsupported operation")
