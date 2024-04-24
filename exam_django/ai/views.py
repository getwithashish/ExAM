from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ai.clients.gemini_client.gemini_client import GeminiClient
from ai.service.ai_chat_with_database_service import AiChatWithDatabaseService
from messages import AI_RESPONSE_OBTAINED_SUCCESSFULLY
from response import APIResponse


class AiChatWithDbView(GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt")

        gemini_client = GeminiClient()
        ai_chat_with_database_service = AiChatWithDatabaseService(gemini_client)
        ai_response = ai_chat_with_database_service.chat_with_database(prompt)
        print("AI Response: ", ai_response)

        return APIResponse(
            message=AI_RESPONSE_OBTAINED_SUCCESSFULLY,
            data=ai_response.text,
            status=status.HTTP_200_OK,
        )
