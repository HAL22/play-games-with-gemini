from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import models
import chatbot
import utils


os.environ["GOOGLE_API_KEY"] = "AIzaSyCkeQ8hI4FCB9u4sDIJSMXeyGH8n13vScU"

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
    board = [[0, 1, 0, 1, 0, 1, 0, 1], 
        [1, 0, 1, 0, 1, 0, 1, 0], 
        [0, 1, 0, 0, 0, 1, 0, 1], 
        [0, 0, 0, 0, 1, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 0, 2, 0, 2, 0, 2, 0], 
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
        ]
    game_board_str = utils.describe_checker_board(board)

    response = cbot.generate_response(input=game_board_str)

    print(response['text'])


    coord_str = utils.extract_list(response['text'])

    move = models.Move(x1=int(coord_str[0]),y1=int(coord_str[1]),x2=int(coord_str[2]),y2=int(coord_str[3]))

    return move