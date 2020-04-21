from typing import List, Mapping
from yaits_api.constants import (
    USERNAME_CHARS_WHITELIST,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
)
from yaits_api.exceptions.auth import (
    CreateUserBadUsername,
    CreateUserBadPassword,
    CreateUserBadRequest,
)


def is_valid_username(username) -> bool:
    if not isinstance(username, str):
        return False
    if len(username) < USERNAME_MIN_LENGTH or \
            len(username) > USERNAME_MAX_LENGTH:
        return False
    return all(c in USERNAME_CHARS_WHITELIST for c in username)


def is_valid_password(password) -> bool:
    if not isinstance(password, str):
        return False
    return len(password) >= PASSWORD_MIN_LENGTH


def validate_auth_user(request_data: Mapping) -> List[str]:
    """If valid data, return [username, password]"""
    if not isinstance(request_data, Mapping):
        raise CreateUserBadRequest()

    username = request_data.get('username')
    password = request_data.get('password')

    if not is_valid_username(username):
        raise CreateUserBadUsername()
    if not is_valid_password(password):
        raise CreateUserBadPassword()

    return username, password

