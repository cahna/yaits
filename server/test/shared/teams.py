from typing import Mapping
from flask.testing import FlaskClient
from .request import auth_header
from .response import verify_api_response


def verify_create_team(client: FlaskClient,
                       team_name: str,
                       access_token: str,
                       expect_slug: str = None,
                       expect_owner: str = None) -> Mapping:
    response = client.post('/teams',
                           json={'name': team_name},
                           headers=auth_header(access_token),
                           follow_redirects=True)

    data = verify_api_response(response)

    assert data['name'] == team_name
    assert 'slug' in data
    assert 'owner' in data
    assert len(data['members']) == 1

    if expect_slug:
        assert data['slug'] == expect_slug

    if expect_owner:
        assert data['owner']['username'] == expect_owner
        assert data['members'][0]['username'] == expect_owner

    return data


def verify_create_issue_status(client: FlaskClient,
                               team_slug: str,
                               access_token: str,
                               issue_name: str,
                               issue_description: str = None,
                               expect_ordering: int = 0) -> Mapping:
    payload = dict(name=issue_name)

    if issue_description:
        payload['description'] = issue_description

    response = client.post(f'/teams/{team_slug}/issue_statuses',
                           headers=auth_header(access_token),
                           json=payload,
                           follow_redirects=True)

    data = verify_api_response(response)

    assert data['uniqueId']
    assert data['name'] == issue_name
    assert data['description'] == (issue_description or '')
    assert data['ordering'] == expect_ordering

    return data
