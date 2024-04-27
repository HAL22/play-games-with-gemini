from  langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

class ChatBot:
    def __init__(self) -> None:
        self.model = ChatGoogleGenerativeAI(model="gemini-pro")
        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system","You are playing american checkers with a human, and jumping when available is enforced. Answer by giving the position of the checker piece you want to move and the tile position you want to move the piece too. Here's an example of the output: I move the Black piece at [5, 0] to [4, 1]."),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "I have played, it's your turn. You play the Black pieces and here is the representation of the checkers board: {input}")
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

        self.history.append(HumanMessage(content=input))
        self.history.append(AIMessage(content=response['text']))

        return response

        




