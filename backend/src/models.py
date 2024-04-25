from pydantic import BaseModel

class Board(BaseModel):
    board: list[list[str]]

class Move(BaseModel):
    x1:int
    y1:int
    x2:int
    y2:int
