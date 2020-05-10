from flask.testing import FlaskClient
from .shared.request import auth_header
from .shared.response import verify_api_response
from .shared.auth import verify_register_user, verify_login_user


def test_mutation_create_team(client: FlaskClient):
    username = 'Mutationer'
    password = 'PostPutPatchQL'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    team_name = 'Test GraphQL'
    body = (f'mutation {{\n'
            f'  createTeam(name: "{team_name}") {{\n'
            f'    team {{\n'
            f'      id\n'
            f'      name\n'
            f'      owner {{\n'
            f'        id\n'
            f'        username\n'
            f'      }}\n'
            f'    }}\n'
            f'  }}\n'
            f'}}\n')
    response = client.post('/graphql',
                           headers=auth_header(access_token),
                           json=dict(query=body))
    payload = verify_api_response(response)

    data = payload.get('data')
    assert data
    assert 'createTeam' in data

    team = data.get('createTeam').get('team')
    assert team['name'] == team_name
    assert team['id']
    assert team['owner']
    assert team['owner']['id']
    assert team['owner']['username'] == username
