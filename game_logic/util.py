import random
from collections.abc import Generator
from typing import Any


def roll_dices(dices: list[int]) -> list[int]:
    return sorted([random.randint(1, d) for d in dices])


def points_to_groupings(points: list[int], partitions: list[list[int]]) -> list[list[int]]:
    result = []
    for partition in partitions:
        grouping = sorted([sum(points[i] for i in subset) for subset in partition])
        if len(result) == 0 or grouping != result[-1]:
            result.append(grouping)
    return result


def int_generator(start: int = 0) -> Generator[int]:
    while True:
        yield start
        start += 1


def input_handler(prompt: str, allowed_inputs: list[str]) -> str:
    resp = None
    while resp not in allowed_inputs:
        resp = input(prompt + " -> ")
    return resp


def yes_no(question: str) -> bool:
    return input_handler(question + " [y/n]", ["y", "n"]) == "y"


def multiple_choice(options: list[Any], question: str = "Choose one") -> int:
    a = ord('a')
    for i, opt in enumerate(options):
        print(f"[{chr(a+i)}] {str(opt)}")
    return ord(input_handler(question, [chr(ord('a') + i) for i in range(len(options))])) - a




