from rest_framework.renderers import JSONRenderer


class ApiResponseJsonRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {
            "message": renderer_context.get("message", ""),
            "data": data,
        }
        return super().render(response_data, accepted_media_type, renderer_context)
