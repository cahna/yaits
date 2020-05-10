from flask.testing import FlaskClient
from .shared.request import auth_header
from .shared.response import verify_api_response
from .shared.auth import verify_register_user, verify_login_user


def test_query_active_user(client: FlaskClient):
    username = 'GraphQLTestUser'
    password = 'RESTISDEAD'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)
    query = '''{
        currentUser {
            id
            uniqueId
            username
            dateCreated
        }
     }'''
    response = client.post('/graphql',
                           headers=auth_header(access_token),
                           json=dict(query=query))
    payload = verify_api_response(response)

    data = payload.get('data')
    assert data
    assert 'currentUser' in data

    current_user = data.get('currentUser')
    assert 'hashedPw' not in current_user
    assert 'hashed_pw' not in current_user
    assert current_user['username'] == username
    assert current_user['id'] == current_user['uniqueId']
    assert current_user['dateCreated']
    assert 'teams' not in current_user


