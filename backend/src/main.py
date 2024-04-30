from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import models
import chatbot
import utils
from typing import List


os.environ["GOOGLE_API_KEY"] = "AIzaSyD7_i-0TvZnfY-p4rPgyQMWXOj18F-ScKA"

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
    game_board_str = utils.describe_checker_board(game_board.board)
    
    input = ""
    error_message = ""
    error_message += game_board.error
    if error_message == "":
        input += f"I have played, it's your turn. You play the Black pieces and here is the representation of the checkers board: {game_board_str}" 
    else:
        input += f"Your previous move was incorrect.{error_message}.Play again here is the representation of the checkers board: {game_board_str}"

    while(True):
        response = generate_response(input=input)
        coord_str = utils.extract_list(response)
        valid, move = validate_move(8,8,coord_str,game_board.board)
        if valid:
            return move
        else:
            input = f"Your previous move was incorrect.Play again here is the representation of the checkers board: {game_board_str}"


def generate_response(input):
    print("User input: "+input)
    response = cbot.generate_response(input=input)
    print("AI output: "+response['text'])
    return response['text']

def validate_move(row_len,column_len, coords,game_board:List[List:int]):
    x1 = int(coords[0])
    y1 = int(coords[1])
    x2 = int(coords[2])
    y2 = int(coords[3])

    move = models.Move(x1=x1,x2=x2,y1=y1,y2=y2)

    if move.x1 < 0 or move.y1 < 0 or move.x1 >=row_len or move.y1 >= column_len:
        print("Move validation failed")
        return False,move
    if move.x2 < 0 or move.y2 < 0 or move.x2 >=row_len or move.y2 >= column_len:
        print("Move validation failed")
        return False,move
    
    if game_board[x1][y1] != 2:
        print("Move validation failed")
        return False,move
    
    if game_board[x2][y2] != 0:
        print("Move validation failed")
        return False,move

    return True,move
