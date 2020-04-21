from flask.testing import FlaskClient
from .shared.request import auth_header
from .shared.response import verify_api_response
from .shared.auth import verify_register_user, verify_login_user


def test_create_team(client: FlaskClient):
    username = 'TestTeamAdmin'
    password = '$uper_Team'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'My Test Team'

    response = client.post('/teams',
                           json={'name': team_name},
                           headers=auth_header(access_token),
                           follow_redirects=True)

    data = verify_api_response(response)

    assert data['name'] == team_name
    assert data['slug'] == 'my-test-team'
    assert data['owner']['username'] == username
    assert len(data['members']) == 1
    assert data['members'][0]['username'] == username
