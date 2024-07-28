class Player:


    def __init__(self, path_lengths: list[int], name: str) -> None:
        self.total_moves: int = 0
        self.state: list[int] = path_lengths.copy()
        self.temp: dict[int, int] = {}
        self.name = name


    def take_action(self, path: int) -> None:
        if path not in self.temp:
            self.temp[path] = 1
        else:
            self.temp[path] += 1
        return
    

    def undo_action(self, path: int) -> None:
        if self.temp[path] == 1:
            del self.temp[path]
        else:
            self.temp[path] -= 1


    def update_state(self) -> None:
        for path in self.temp:
            self.state[path] -= self.temp[path]
        return


    def reset_temp(self) -> None:
        self.temp.clear()
        return


    def add_moves(self, move: int) -> None:
        self.total_moves += move


    def is_winner(self, goal: int) -> bool:
        count = 0
        for x in self.state:
            if x == 0:
                count += 1
        return count >= goal