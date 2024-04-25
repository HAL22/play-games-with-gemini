from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
async def root():
    move = models.Move(x1=5,y1=0,x2=4,y2=1)
    return move