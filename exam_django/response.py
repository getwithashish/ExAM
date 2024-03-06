from rest_framework.response import Response


class APIResponse(Response):
    def __init__(
        self,
        data=None,
        status=None,
        message="",
        template_name=None,
        headers=None,
        exception=False,
        content_type=None,
    ):
        super().__init__(
            {"message": message, "data": data},
            status,
            template_name,
            headers,
            exception,
            content_type,
        )
