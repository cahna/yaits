import random
import string
from yaits_api.constants import (
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_CHARS_WHITELIST,
)

VALID_CHARACTERS = string.ascii_letters + string.digits


def random_string(length: int, alphabet: str = VALID_CHARACTERS) -> str:
    return ''.join([
        random.choice(VALID_CHARACTERS) for _ in range(length)
    ])


def random_valid_username() -> str:
    return random_string(random.randint(USERNAME_MIN_LENGTH,
                                        USERNAME_MAX_LENGTH),
                         USERNAME_CHARS_WHITELIST)
