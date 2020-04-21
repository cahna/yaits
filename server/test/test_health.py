from flask import Flask
from flask.testing import FlaskClient
from flask_jwt_extended import create_access_token
from .shared.request import auth_header
from .shared.response import verify_api_response, verify_error_response


def test_healthcheck_endpoint(client: FlaskClient):
    response = client.get('/health', follow_redirects=True)
    data = verify_api_response(response)
    assert data


def test_db_healthcheck_endpoint_no_auth(client: FlaskClient):
    response = client.get('/health/db', follow_redirects=True)
    verify_error_response(response, 401)


def test_db_health_with_auth(test_app: Flask, client: FlaskClient):
    with test_app.app_context():
        access_token = create_access_token(identity={'user': 'test-user'})

    response = client.get('/health/db',
                          headers=auth_header(access_token),
                          follow_redirects=True)

    verify_api_response(response)
