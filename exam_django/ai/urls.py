from django.urls import path

from ai.views import AiChatWithDbView


urlpatterns = [path("", AiChatWithDbView.as_view(), name="ai")]
