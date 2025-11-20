board = [' ']*9
player = 'X'

def print_board():
    print()
    print(f" {board[0]} | {board[1]} | {board[2]}")
    print("---|---|---")
    print(f" {board[3]} | {board[4]} | {board[5]}")
    print("---|---|---")
    print(f" {board[6]} | {board[7]} | {board[8]}")
    print()

def check_win(p):
    wins = [(0,1,2),(3,4,5),(6,7,8),
            (0,3,6),(1,4,7),(2,5,8),
            (0,4,8),(2,4,6)]
    return any(board[a]==board[b]==board[c]==p for a,b,c in wins)

def is_draw():
    return all(s != ' ' for s in board)

while True:
    print_board()
    move = int(input(f"Player {player}, enter move (1-9): ")) - 1

    if move < 0 or move > 8 or board[move] != ' ':
        print("Invalid move! Try again.")
        continue

    board[move] = player

    if check_win(player):
        print_board()
        print(f"Player {player} wins!")
        break

    if is_draw():
        print_board()
        print("It's a DRAW!")
        break

    player = 'O' if player == 'X' else 'X'
