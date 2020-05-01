from flask.testing import FlaskClient
from .shared.request import auth_header
from .shared.response import verify_error_response
from .shared.auth import verify_register_user, verify_login_user


def test_create_user_bad_request(client: FlaskClient):
    response = client.post('/auth/register', follow_redirects=True)
    verify_error_response(response, 422)


def test_create_user_missing_password(client: FlaskClient):
    response = client.post('/auth/register',
                           json=dict(username='ForgotAPassword'),
                           follow_redirects=True)
    verify_error_response(response, 422)


def test_create_user_missing_username(client: FlaskClient):
    response = client.post('/auth/register',
                           json=dict(password='ForgotAUsername'),
                           follow_redirects=True)
    verify_error_response(response, 422)


def test_create_user_empty_password(client: FlaskClient):
    response = client.post('/auth/register',
                           json=dict(username='UserFoo', password=''),
                           follow_redirects=True)
    verify_error_response(response, 422)


def test_create_user_password_too_short(client: FlaskClient):
    response = client.post('/auth/register',
                           json=dict(username='UserFoo', password='123'),
                           follow_redirects=True)
    verify_error_response(response, 422)


def test_create_user_username_already_exists(client: FlaskClient):
    username = 'BillWithers'
    verify_register_user(client, username, 'Ain\'t No Sunshine')

    payload = dict(username=username, password='_0123456789ABCDEF_')
    response = client.post('/auth/register',
                           json=payload,
                           follow_redirects=True)
    verify_error_response(response, 409)


def test_logout_without_jwt(client: FlaskClient):
    response = client.post('/auth/logout', follow_redirects=True)
    verify_error_response(response, 401, 'Missing Authorization Header')


def test_create_user_with_refresh_token_disallowed(client: FlaskClient):
    username = 'JesusQuintana'
    password = 'NobodyF*cksWith'
    verify_register_user(client, username, password)
    _, refresh_token = verify_login_user(client, username, password)

    response = client.get('/auth/active_user',
                          headers=auth_header(refresh_token),
                          follow_redirects=True)
    verify_error_response(response, 422, "Only access tokens are allowed")
