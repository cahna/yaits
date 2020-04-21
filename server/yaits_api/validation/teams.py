from typing import Mapping
from yaits_api.constants import (
    TEAM_NAME_CHARS_WHITELIST,
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_MIN_LENGTH,
)
from yaits_api.exceptions.teams import (
    CreateTeamBadName,
    CreateTeamBadRequest,
)


def is_valid_team_name(team_name) -> bool:
    if not isinstance(team_name, str):
        return False
    if len(team_name) < TEAM_NAME_MIN_LENGTH or \
            len(team_name) > TEAM_NAME_MAX_LENGTH:
        return False
    return all(c in TEAM_NAME_CHARS_WHITELIST for c in team_name)


def validate_create_team(request_data: Mapping) -> str:
    """If valid data, return team_name"""
    if not isinstance(request_data, Mapping):
        raise CreateTeamBadRequest()

    team_name = request_data.get('name')

    if not is_valid_team_name(team_name):
        raise CreateTeamBadName()

    return team_name

