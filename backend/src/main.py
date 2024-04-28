from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import models
import chatbot
import utils


os.environ["GOOGLE_API_KEY"] = ""

cbot = chatbot.ChatBot()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/play")
async def root(game_board: models.GameBoard):
    
    error_message = ""
    error_message += game_board.error
    
    game_board_str = utils.describe_checker_board(game_board.board)

    postive_input = f"I have played, it's your turn. You play the Black pieces and here is the representation of the checkers board: {game_board_str}"

    negative_input = f"Your previous move was incorrect.{error_message}.Play again here is the representation of the checkers board: {game_board_str}"

    if error_message == "":
        response = cbot.generate_response(input=postive_input)
        print("AIMessage: "+response['text'])
        coord_str = utils.extract_list(response['text'])
        move = models.Move(x1=int(coord_str[0]),y1=int(coord_str[1]),x2=int(coord_str[2]),y2=int(coord_str[3]))
        return move


    response = cbot.generate_response(input=negative_input)

    print("AIMessage: "+response['text'])

    coord_str = utils.extract_list(response['text'])

    move = models.Move(x1=int(coord_str[0]),y1=int(coord_str[1]),x2=int(coord_str[2]),y2=int(coord_str[3]))

    return move