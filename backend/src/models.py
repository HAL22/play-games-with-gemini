from pydantic import BaseModel
from typing import List

class GameBoard(BaseModel):
    board: List[List[int]]
    error: str

class Move(BaseModel):
    x1:int
    y1:int
    x2:int
    y2:int
