from player import Player
from util import (
    roll_dices, points_to_groupings,
    yes_no, multiple_choice,
    int_generator,
)


def start_game():
    while yes_no("New game?"):
        Round(2).start()
    print("********** Thank you for playing! **********")


class Round:


    def __init__(self, num_players: int):
        self.path_lengths: list[int] = [
            -1,
            -1, 3, 5, 7, 9,
            11, 13, 11, 9, 7,
            5, 3,
        ]
        self.dices = [6, 6, 6, 6]
        self.partitions = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]]
        self.max_num_paths = 3
        self.goal = 3
        
        self.players = [Player(self.path_lengths, str(i+1)) for i in range(num_players)]
        
        return


    def start(self) -> None:
        for turn in int_generator(1):
            for player in self.players:
                print(f"===== TURN {turn} OF PLAYER {player.name} =====")
                self._print_board()
                for move in int_generator(1):
                    is_successful, continues = self._move(move, player)
                    if not is_successful:
                        player.add_moves(move)
                        break
                    if not continues:
                        player.add_moves(move)
                        player.update_state()
                        if player.is_winner(self.goal):
                            print(f"!!!! PLAYER {player.name} WON ({turn} TURNS, {player.total_moves} MOVES) !!!!")
                            return
                        break
                player.reset_temp()
        return
    

    def _move(self, move: int, player: Player) -> tuple[bool, bool]:
        print(f"---------- MOVE {move} ----------")
        input("Press enter to roll the dices ... ")
        points = roll_dices(self.dices)
        print(f"Result: {points}")
        groupings = points_to_groupings(points, self.partitions)

        actions: list[list[int]] = []
        options: list[str] = []
        for p1, p2 in groupings:
            if self._is_valid_action([p1, p2], player):
                actions.append([p1, p2])
                options.append(f"{p1}*, {p2}*")
                continue
            if self._is_valid_action([p1], player):
                actions.append([p1])
                options.append(f"{p1}*, {p2}")
            if p2 != p1 and self._is_valid_action([p2], player):
                actions.append([p2])
                options.append(f"{p1}, {p2}*")
        
        if len(options) == 0:
            print(f"No valid action: turn ends")
            return False, True

        choice = multiple_choice(options, "Pick a move")
        for path in actions[choice]:
            player.take_action(path)

        self._print_board()
        return True, yes_no("Continue?")


    def _print_board(self) -> None:
        for path, length in enumerate(self.path_lengths):
            if length == -1:
                continue
            else:
                print(f"{path}: {self._path_to_string(path, length)}")
        return
    

    def _path_to_string(self, path: int, length: int) -> str:
        for player in self.players:
            if player.state[path] == 0:
                return str([[player.name] for _ in range(length)])
        path_list = [[] for _ in range(length)]
        for player in self.players:
            i = length - player.state[path]
            if i != 0:
                path_list[i-1].append(player.name)
            if path in player.temp:
                for j in range(player.temp[path]):
                    path_list[i+j].append("o")
        return str(path_list)

    
    def _is_completed(self, path: int) -> bool:
        for player in self.players:
            if player.state[path] == 0:
                return True
        return False


    def _is_valid_path(self, path: int, player: Player) -> bool:
        if self._is_completed(path):
            return False
        if path in player.temp:
            return player.state[path] - player.temp[path] > 0
        else:
            return len(player.temp) < self.max_num_paths


    def _is_valid_action(self, action: list[int], player: Player) -> bool:
        for i, path in enumerate(action):
            if not self._is_valid_path(path, player):
                for j in range(i-1,-1,-1):
                    player.undo_action(action[j])
                return False
            player.take_action(path)
        for path in action:
            player.undo_action(path)
        return True
