from django.http import JsonResponse


class APIResponse(JsonResponse):

    def __init__(
        self,
        data=None,
        status=None,
        message="",
        headers=None,
        json_dumps_params=None,
    ):
        response_data = {"message": message, "data": data}

        super().__init__(
            response_data,
            status=status,
            headers=headers,
            json_dumps_params=json_dumps_params,
        )
