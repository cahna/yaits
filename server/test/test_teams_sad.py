import sys
from flask.testing import FlaskClient
from yaits_api.constants import (
    UUID_LENGTH,
    ISSUE_STATUS_MAX_LENGTH,
    ISSUE_SHORT_DESCRIPTION_MAX_LENGTH,
)
from .shared.util import random_string
from .shared.request import auth_header
from .shared.response import verify_error_response
from .shared.auth import verify_register_user, verify_login_user
from .shared.teams import verify_create_team, verify_create_issue_status


def test_create_team_without_jwt(client: FlaskClient):
    response = client.post('/teams',
                           json=dict(name='Unit Test Team'),
                           follow_redirects=True)
    verify_error_response(response, 401, 'Missing Authorization Header')


def test_create_team_invalid_jwt(client: FlaskClient):
    response = client.post('/teams',
                           json=dict(name='Test Team'),
                           headers=auth_header('_JWT_'),
                           follow_redirects=True)
    verify_error_response(response, 422, 'Not enough segments')


def test_create_team_with_refresh_token_disallowed(client: FlaskClient):
    username = 'Walter.Sobchak'
    password = 'Eight year olds, Dude.'
    verify_register_user(client, username, password)
    _, refresh_token = verify_login_user(client, username, password)

    response = client.post('/teams',
                           json=dict(name='VietnamVets'),
                           headers=auth_header(refresh_token),
                           follow_redirects=True)
    verify_error_response(response, 422, 'Only access tokens are allowed')


def test_create_team_rejects_slug_collission(client: FlaskClient):
    username = 'Fawn-Knutsen'
    password = 'Bunny*La*Joya'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'Shopaholics'
    verify_create_team(client, team_name, access_token,
                       expect_slug='shopaholics',
                       expect_owner=username)

    reject_name = '-Shopaholics-'
    response = client.post('/teams',
                           json={'name': reject_name},
                           headers=auth_header(access_token),
                           follow_redirects=True)
    verify_error_response(response, 409, 'Slug collission')


def test_create_issue_status_rejects_name_collission(client: FlaskClient):
    username = 'B.A.Baracus'
    password = 'pteromerhanophobia'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'The A Team'
    team_slug = 'the-a-team'
    verify_create_team(client, team_name, access_token,
                       expect_slug=team_slug,
                       expect_owner=username)

    s1_name = 'Planned'
    verify_create_issue_status(client, team_slug, access_token, s1_name)

    response = client.post(f'/teams/{team_slug}/issue_statuses',
                           headers=auth_header(access_token),
                           json=dict(name=s1_name),
                           follow_redirects=True)
    verify_error_response(response, 409, 'Name collission')


def test_create_issue_status_rejects_bad_names(client: FlaskClient):
    username = 'BugsBunny'
    password = 'wbrothers'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'The toon Squad'
    team_slug = 'the-toon-squad'
    verify_create_team(client, team_name, access_token,
                       expect_slug=team_slug,
                       expect_owner=username)

    name_test_cases = [
        {},
        [],
        0,
        -1,
        sys.maxsize,
        True,
        random_string(2 * ISSUE_STATUS_MAX_LENGTH),
    ]

    for name in name_test_cases:
        response = client.post(f'/teams/{team_slug}/issue_statuses',
                               headers=auth_header(access_token),
                               json=dict(name=name),
                               follow_redirects=True)
        verify_error_response(response, 400, 'Invalid name')


def test_create_issue_rejects_bad_requests(client: FlaskClient):
    username = 'AshKetchum'
    password = 'p0k3mOn!'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'Pallet Town'
    team_slug = 'pallet-town'
    verify_create_team(client, team_name, access_token,
                       expect_slug=team_slug,
                       expect_owner=username)

    status_name = 'Open'
    status_description = 'Ready for work'
    status = verify_create_issue_status(client,
                                        team_slug,
                                        access_token,
                                        status_name,
                                        status_description)

    # Invalid JSON payloads
    test_case_payload = [
        True,
        {'id': 'test'},
        sys.maxsize,
        ['test'],
        '',
    ]

    for payload in test_case_payload:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json=payload,
                               follow_redirects=True)
        verify_error_response(response, 400)

    # Bad assignee
    test_case_assigned_to = [
        'invalid',
        True,
        {'id': 'test'},
        sys.maxsize,
    ]

    for assigned_to in test_case_assigned_to:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json={
                                   'shortDescription': 'Wake Snorlax',
                                   'description': 'Get Poke Flute',
                                   'statusUniqueId': status['uniqueId'],
                                   'assignedToUniqueId': assigned_to,
                               },
                               follow_redirects=True)
        verify_error_response(response, 400, 'invalid assignedToUniqueId')

    # Bad short description
    test_case_short_description = [
        'z',
        True,
        {'id': 'test'},
        sys.maxsize,
        ['test'],
        random_string(2 * ISSUE_SHORT_DESCRIPTION_MAX_LENGTH),
    ]

    for short_description in test_case_short_description:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json={
                                   'shortDescription': short_description,
                                   'description': 'Get Poke Flute',
                                   'statusUniqueId': status['uniqueId'],
                                   'assignedToUniqueId': assigned_to,
                               },
                               follow_redirects=True)
        verify_error_response(response, 400, 'invalid shortDescription')

    # Bad description
    test_case_description = [
        True,
        {'id': 'test'},
        sys.maxsize,
        ['test'],
    ]

    for description in test_case_description:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json={
                                   'shortDescription': 'Wake Snorlax',
                                   'description': description,
                                   'statusUniqueId': status['uniqueId'],
                                   'assignedToUniqueId': assigned_to,
                               },
                               follow_redirects=True)
        verify_error_response(response, 400, 'invalid description')

    # Bad status uuid
    test_case_status_id = [
        True,
        {'uniqueId': random_string(UUID_LENGTH)},
        random_string(UUID_LENGTH // 2),
        sys.maxsize,
        ['test'],
    ]

    for status_id in test_case_status_id:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json={
                                   'shortDescription': 'Wake Snorlax',
                                   'description': 'Get Poke Flute',
                                   'priority': 2,
                                   'statusUniqueId': status_id,
                               },
                               follow_redirects=True)
        verify_error_response(response, 400, 'invalid statusUniqueId')

    # Bad priority
    test_case_priority = [
        -2,
        {'uniqueId': random_string(UUID_LENGTH)},
        random_string(UUID_LENGTH // 2),
        sys.maxsize,
        ['test'],
    ]

    for priority in test_case_priority:
        response = client.post(f'/teams/{team_slug}/issues',
                               headers=auth_header(access_token),
                               json={
                                   'shortDescription': 'Wake Snorlax',
                                   'description': 'Get Poke Flute',
                                   'statusUniqueId': status['uniqueId'],
                                   'priority': priority,
                               },
                               follow_redirects=True)
        verify_error_response(response, 400, 'invalid priority')
