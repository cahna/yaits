from flask.testing import FlaskClient
from .shared.request import auth_header
from .shared.response import verify_error_response
from .shared.auth import (
    verify_register_user,
    verify_logout_user,
    verify_login_user,
    verify_get_active_user,
    verify_refresh_token,
)


def test_register_user(client: FlaskClient):
    username = 'abcdefghijklmnopqrstuvwxyz'
    password = '*0123456789_ABCDEF#'
    verify_register_user(client, username, password)


def test_register_login_logout(client: FlaskClient):
    username = 'Steve_Lukath3r'
    password = 'Never Walk Alone'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)
    verify_logout_user(client, access_token)


def test_logout_then_login_gives_new_token(client: FlaskClient):
    username = 'TigerKing'
    password = 'T.B. Carole Baskin'
    verify_register_user(client, username, password)
    access_token1, _ = verify_login_user(client, username, password)
    verify_logout_user(client, access_token1)
    access_token2, _ = verify_login_user(client, username, password)

    assert access_token1 != access_token2, \
        'Should have received a new token'


def test_get_existing_user(client: FlaskClient):
    username = 'abc123'
    password = 'P4ssW0rD:D'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)
    verify_get_active_user(client, access_token, username)


def test_register_then_actions_then_logout(client: FlaskClient):
    # Register a new user
    username = 'JonathanMoffett'
    password = '$ugarfoot'
    verify_register_user(client, username, password)
    access_token, _ = verify_login_user(client, username, password)

    # Perform actions with valid token
    verify_get_active_user(client, access_token, username)
    verify_get_active_user(client, access_token, username)

    # Logout
    verify_logout_user(client, access_token)

    # Attempt action with same token (should fail)
    response = client.get(f'/auth/active_user',
                          headers=auth_header(access_token),
                          follow_redirects=False)
    verify_error_response(response, 401)


def test_refresh_token(client: FlaskClient):
    username = 'noobnoob'
    password = 'Hunter12'
    verify_register_user(client, username, password)
    access_token, refresh_token = verify_login_user(client, username, password)

    # Perform action with valid token
    verify_get_active_user(client, access_token, username)

    # Request refresh of token
    new_access_token = verify_refresh_token(client, refresh_token)

    # Perform action with new token
    verify_get_active_user(client, new_access_token, username)
