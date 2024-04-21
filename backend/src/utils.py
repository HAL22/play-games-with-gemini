def describe_checker_board(board) -> str:
    """assumes a standard 8×8 checkerboard layout"""
    description = ''
    for rank, row in enumerate(reversed(board)):
        for file, square in enumerate(row):
            if square == '_':
                description += f'Empty square at position [{file}, {rank}] '
            elif square == 'B':
                description += f'Black piece at position [{file}, {rank}] '
            elif square == 'W':
                description += f'White piece at position [{file}, {rank}] '
    return description