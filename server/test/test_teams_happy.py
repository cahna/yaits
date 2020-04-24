from flask.testing import FlaskClient
from .shared.auth import verify_register_user, verify_login_user
from .shared.teams import (
    verify_create_team,
    verify_create_issue_status,
    verify_create_issue,
)


def test_create_team(client: FlaskClient):
    username = 'TestTeamAdmin'
    password = '$uper_Team'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'My Test Team'
    verify_create_team(client, team_name, access_token,
                       expect_slug='my-test-team',
                       expect_owner=username)


def test_create_issue_statuses(client: FlaskClient):
    username = 'MichaelJordan23'
    password = 'theLa$tD4nce'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = '90s Chicago Bulls'
    team_slug = '90s-chicago-bulls'
    verify_create_team(client, team_name, access_token,
                       expect_slug=team_slug,
                       expect_owner=username)

    s1_name = 'Draft'
    data1 = verify_create_issue_status(client,
                                       team_slug,
                                       access_token,
                                       s1_name,
                                       expect_ordering=6)

    s2_name = 'Open'
    s2_description = 'Awaiting assignment'
    data2 = verify_create_issue_status(client,
                                       team_slug,
                                       access_token,
                                       s2_name,
                                       s2_description,
                                       expect_ordering=7)

    assert data2['uniqueId'] != data1['uniqueId']


def test_create_issue(client: FlaskClient):
    username = 'Anothertestuser'
    password = 'jfdksalvadakvlj'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'SupremeTeam'
    team_slug = 'supremeteam'
    verify_create_team(client, team_name, access_token,
                       expect_slug=team_slug,
                       expect_owner=username)

    status_name = 'Done'
    status_description = 'Finished'
    status = verify_create_issue_status(client,
                                        team_slug,
                                        access_token,
                                        status_name,
                                        status_description,
                                        expect_ordering=6)
    status_uuid = status['uniqueId']

    issue_short_description = 'Create Hello World'
    issue_description = 'Perform all of the work'
    issue = verify_create_issue(client,
                                team_slug,
                                access_token,
                                status_uuid,
                                issue_short_description,
                                issue_description)

    assert issue['createdBy']['username'] == username
    assert issue['assignedTo']['username'] == username
