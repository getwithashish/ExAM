import google.generativeai as genai
import google.ai.generativelanguage as glm


from ai.clients.ai_client_abstract import AiClientAbstract
from ai.config.gemini_config import GOOGLE_API_KEY
from ai.service.database_service.database_table_list_generator import (
    DatabaseTableListGenerator,
)
from ai.service.database_service.database_table_schema_retriever import (
    DatabaseTableSchemaRetriever,
)
from ai.service.database_service.database_sql_executor import DatabaseSqlExecutor


class GeminiClient(AiClientAbstract):

    def __init__(self):
        genai.configure(api_key=GOOGLE_API_KEY, transport="rest")
        self.chat = None

    def get_ai_model(self, *args):
        # model = genai.GenerativeModel("gemini-pro", tools=args)
        model = genai.GenerativeModel(
            "gemini-pro",
            tools=[
                DatabaseTableListGenerator.table_list_generator_description,
                DatabaseTableSchemaRetriever.table_schema_retriever_description,
                DatabaseSqlExecutor.sql_executor_description,
            ],
        )
        return model

    def start_chatting(self, prompt):
        model = self.get_ai_model()
        self.chat = model.start_chat()
        response = self.chat.send_message(prompt)
        return response

    def generate_response(self, prompt, function_call_name=None):
        if self.chat:
            response = self.chat.send_message(
                glm.Content(
                    parts=[
                        glm.Part(
                            function_response=glm.FunctionResponse(
                                name=function_call_name,
                                response={"content": prompt},
                            )
                        )
                    ]
                )
            )
        else:
            response = self.start_chatting(prompt)

        return response.candidates[0].content.parts[0]

    def reset_chat(self):
        for content in self.chat.history:
            part = content.parts[0]
            print(content.role, "->", type(part).to_dict(part))
            print("-" * 80)
        self.chat = None
