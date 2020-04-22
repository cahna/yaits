from typing import Mapping
from yaits_api.constants import (
    TEAM_NAME_CHARS_WHITELIST,
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_MIN_LENGTH,
    ISSUE_STATUS_MIN_LENGTH,
    ISSUE_STATUS_MAX_LENGTH,
)
from yaits_api.exceptions.teams import (
    CreateTeamBadName,
    CreateTeamBadRequest,
    CreateIssueStatusBadRequest,
    CreateIssueStatusBadName,
    CreateIssueStatusBadDescription,
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


def is_valid_status_name(status_name: str) -> bool:
    return isinstance(status_name, str) and \
        ISSUE_STATUS_MIN_LENGTH <= len(status_name) < ISSUE_STATUS_MAX_LENGTH


def validate_create_issue_status(request_data: Mapping) -> Mapping:
    """If valid, return [name, description]"""
    if not isinstance(request_data, Mapping):
        raise CreateIssueStatusBadRequest()

    status_name = request_data.get('name')
    status_description = request_data.get('description', '')

    if not is_valid_status_name(status_name):
        raise CreateIssueStatusBadName()

    if not isinstance(status_description, str):
        raise CreateIssueStatusBadDescription()

    return status_name, status_description
