from typing import Mapping
from flask.testing import FlaskClient
from yaits_api.constants import JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME
from .request import auth_header
from .response import (
    verify_api_response, verify_user_response
)


def verify_register_user(client: FlaskClient,
                         username: str,
                         password: str):
    payload = dict(username=username, password=password)
    response = client.post('/auth/register',
                           json=payload,
                           follow_redirects=True)
    data = verify_api_response(response)

    assert 'success' in data
    assert data.get('success') is True
    assert 'user' in data
    user_dto = data.get('user')
    assert 'password' not in user_dto
    assert 'hashedPw' not in user_dto
    assert 'hashed_pw' not in user_dto
    assert 'uniqueId' in user_dto
    assert user_dto.get('username') == username

    return user_dto


def verify_login_user(client: FlaskClient,
                      username: str,
                      password: str) -> str:
    payload = dict(username=username, password=password)
    response = client.post('/auth/login',
                           json=payload,
                           follow_redirects=True)
    data = verify_api_response(response)

    assert JWT_TOKEN_NAME in data, 'Missing token in response'
    token = data.get(JWT_TOKEN_NAME)
    assert isinstance(token, str) and len(token) > 1, \
        f'Invalid token in response: {token}'

    assert JWT_REFRESH_TOKEN_NAME in data, 'Missing refresh token in response'
    refresh_token = data.get(JWT_REFRESH_TOKEN_NAME)
    assert isinstance(refresh_token, str) and len(refresh_token) > 1, \
        f'Invalid refresh token in response: {refresh_token}'

    assert token != refresh_token

    return token, refresh_token


def verify_refresh_token(client: FlaskClient, refresh_token: str) -> str:
    response = client.post('/auth/refresh',
                           headers=auth_header(refresh_token),
                           follow_redirects=True)
    data = verify_api_response(response)
    assert JWT_TOKEN_NAME in data
    token = data.get(JWT_TOKEN_NAME)
    assert isinstance(token, str) and len(token) > 1, \
        f'Invalid token in response: {token}'
    assert token != refresh_token

    return token


def verify_logout_user(client: FlaskClient,
                       access_token: str):
    response = client.post('/auth/logout',
                           headers=auth_header(access_token),
                           follow_redirects=True)
    data = verify_api_response(response)

    assert 'success' in data
    assert data.get('success') is True
    assert JWT_TOKEN_NAME not in data


def verify_get_active_user(client: FlaskClient,
                           access_token: str,
                           username: str = None) -> Mapping:
    assert access_token

    response = client.get('/auth/active_user',
                          headers=auth_header(access_token),
                          follow_redirects=True)

    return verify_user_response(response, username=username)
