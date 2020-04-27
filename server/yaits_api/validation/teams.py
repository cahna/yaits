from typing import Mapping, List
from yaits_api.constants import (
    UUID_LENGTH,
    TEAM_NAME_CHARS_WHITELIST,
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_MIN_LENGTH,
    ISSUE_STATUS_MIN_LENGTH,
    ISSUE_STATUS_MAX_LENGTH,
    ISSUE_SHORT_DESCRIPTION_MIN_LENGTH,
    ISSUE_SHORT_DESCRIPTION_MAX_LENGTH,
)
from yaits_api.models import Team, User
from yaits_api.exceptions.teams import (
    CreateTeamBadName,
    CreateTeamBadRequest,
    CreateIssueStatusBadRequest,
    CreateIssueStatusBadName,
    CreateIssueStatusBadDescription,
    CreateIssueBadRequest,
    UpdateTeamBadRequest,
    UpdateIssueBadRequest,
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


def validate_create_issue(request_data: Mapping,
                          team: Team,
                          user: User) -> Mapping:
    """If valid, return kwargs for services.teams.create_issue()"""
    if not isinstance(request_data, Mapping):
        raise CreateIssueBadRequest()

    create_issue_kwargs = {
        'team': team,
        'created_by': user,
    }

    short_description = request_data.get('shortDescription')
    description = request_data.get('description', '')
    status_uuid = request_data.get('statusUniqueId')
    assigned_to_uuid = request_data.get('assignedToUniqueId')
    priority = request_data.get('priority')

    if isinstance(short_description, str) and \
        ISSUE_SHORT_DESCRIPTION_MIN_LENGTH <= len(short_description) < \
            ISSUE_SHORT_DESCRIPTION_MAX_LENGTH:
        create_issue_kwargs['short_description'] = short_description
    else:
        raise CreateIssueBadRequest('invalid shortDescription')

    if isinstance(description, str):
        create_issue_kwargs['description'] = description
    else:
        raise CreateIssueBadRequest('invalid description')

    if isinstance(status_uuid, str) and len(status_uuid) == UUID_LENGTH:
        create_issue_kwargs['status_uuid'] = status_uuid
    else:
        raise CreateIssueBadRequest('invalid statusUniqueId')

    if assigned_to_uuid:
        if isinstance(assigned_to_uuid, str) and \
                len(assigned_to_uuid) == UUID_LENGTH:
            create_issue_kwargs['assigned_to_uuid'] = assigned_to_uuid
        else:
            raise CreateIssueBadRequest('invalid assignedToUniqueId')

    if priority:
        if not isinstance(priority, int) or priority < 0 or priority >= 10:
            raise CreateIssueBadRequest('invalid priority')
        else:
            create_issue_kwargs['priority'] = priority

    return create_issue_kwargs


def validate_update_issue(request_data: Mapping) -> Mapping:
    """Each property of Issue that can be updated must be whitelisted here"""
    if not isinstance(request_data, Mapping):
        raise UpdateIssueBadRequest()

    updates = {}

    desc = request_data.get('description')
    short_desc = request_data.get('shortDescription')
    priority = request_data.get('priority')
    status_uuid = request_data.get('statusUniqueId')
    assigned_to_uuid = request_data.get('assignedToUniqueId')

    # TODO: Make more strict and based-off model reflection
    if desc and isinstance(desc, str):
        updates['description'] = desc
    if short_desc and isinstance(desc, str):
        updates['short_description'] = short_desc
    if priority and isinstance(priority, int):
        updates['priority'] = priority
    if status_uuid and isinstance(status_uuid, str):
        updates['status_uuid'] = status_uuid
    if assigned_to_uuid and isinstance(assigned_to_uuid, str):
        updates['assigned_to_uuid'] = assigned_to_uuid

    if not updates:
        raise UpdateIssueBadRequest()

    return updates


def validate_manage_team_members(request_data: Mapping) -> List[List]:
    add_users = request_data.get('add', [])
    remove_users = request_data.get('remove', [])

    if not (add_users or remove_users):
        raise UpdateTeamBadRequest()

    if add_users and remove_users:  # Only allows one action per request
        raise UpdateTeamBadRequest()

    if not all(isinstance(uid, str) for uid in add_users + remove_users):
        raise UpdateTeamBadRequest()

    return add_users, remove_users
