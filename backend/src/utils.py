import re

def describe_checker_board(board) -> str:
    """assumes a standard 8×8 checkerboard layout"""
    description = ""
    for rank, row in enumerate(board):
        for file, square in enumerate(row):
            if square == 0:
                description += f'Empty square at position [{rank}, {file}] '
            elif square == 2:
                description += f'Black piece at position [{rank}, {file}] '
            elif square == 1:
                description += f'White piece at position [{rank}, {file}] '           
    return description

def extract_list(text):
    """Extracts a list of items from a string.

    Args:
        text: The string to extract the list from.

    Returns:
        A list of items extracted from the string.
    """

    # Find all substrings that start with '[' and end with ']'.
    matches = re.findall(r'\[(.*?)\]', text)

    # Split each substring by commas to get the individual items.
    items = []
    for match in matches:
        items.extend(match.split(','))

    # Strip any whitespace from the items.
    items = [item.strip() for item in items]

    return items