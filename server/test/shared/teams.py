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
    assert len(data['issueStatuses']) == 6

    if expect_slug:
        assert data['slug'] == expect_slug

    if expect_owner:
        assert data['owner']['username'] == expect_owner
        assert data['members'][0]['username'] == expect_owner

    return data


def verify_create_issue_status(client: FlaskClient,
                               team_slug: str,
                               access_token: str,
                               status_name: str,
                               status_description: str = None,
                               expect_ordering: int = 0) -> Mapping:
    payload = dict(name=status_name)

    if status_description:
        payload['description'] = status_description

    response = client.post(f'/teams/{team_slug}/issue_statuses',
                           headers=auth_header(access_token),
                           json=payload,
                           follow_redirects=True)

    data = verify_api_response(response)

    assert data['uniqueId']
    assert data['name'] == status_name
    assert data['description'] == (status_description or '')
    assert data['ordering'] == expect_ordering

    return data


def verify_create_issue(client: FlaskClient,
                        team_slug: str,
                        access_token: str,
                        status_uuid: str,
                        short_description: str,
                        description: str = None) -> Mapping:
    payload = {
        'shortDescription': short_description,
        'statusUniqueId': status_uuid,
    }

    if description:
        payload['description'] = description

    response = client.post(f'/teams/{team_slug}/issues',
                           headers=auth_header(access_token),
                           json=payload,
                           follow_redirects=True)

    data = verify_api_response(response)

    assert data['uniqueId']
    assert data['shortDescription'] == short_description

    if description:
        assert data['description'] == description

    assert data['status']['uniqueId'] == status_uuid
    assert data['createdBy']
    assert data['assignedTo']
    assert data['dateCreated']
    assert data['dateUpdated']
    assert data['priority'] == 0

    return data
