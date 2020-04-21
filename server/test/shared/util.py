import random
from .constants import VALID_CHARACTERS


def random_string(length: int) -> str:
    return ''.join([
        random.choice(VALID_CHARACTERS) for _ in range(length)
    ])


def random_valid_username() -> str:
    return random_string(random.randint(1, 63))
