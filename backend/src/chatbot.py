from  langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import HumanMessage, AIMessage

class ChatBot:
    def __init__(self) -> None:
        self.model = ChatGoogleGenerativeAI(model="gemini-pro")
        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system",""),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{input}")
            ]
        )
        self.history = []

    def generate_response(self,input):
        chain = LLMChain(
            llm=self.model,
            prompt=self.prompt,
        )

        response = chain.invoke({
            "input":input,
            "chat_history":self.history
        })

        self.hisotry.append(HumanMessage(content=input))
        self.hisotry.append(AIMessage(content=response))

        return response.content

        




