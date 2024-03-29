# views.py
from rest_framework.views import APIView
from django.http import JsonResponse
import json


class QueryBuilderView(APIView):
    # Assume you have a function to process the CEL query

    def post(self, request):
        if request.method == "POST":
            # Retrieve the CEL query from the request body
            data = json.loads(request.body)
            cel_query = data.get("cel_query")

            # Process the CEL query
            result = process_cel_query(cel_query)

            # Return the response
            return JsonResponse({"result": result})

        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)


def process_cel_query(cel_query):
    try:

        return cel_query
    except Exception as e:
        return str(e)
