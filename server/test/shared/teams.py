from typing import Mapping, List
from flask.testing import FlaskClient
from .request import auth_header
from .response import verify_api_response, verify_error_response


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


def verify_add_team_members(client: FlaskClient,
                            access_token: str,
                            team_slug: str,
                            users: List[Mapping]) -> Mapping:
    assert users
    payload = dict(users=[{
        'username': u['username'],
        'uniqueId': u['uniqueId'],
    } for u in users])
    response = client.patch(f'/teams/{team_slug}/members',
                            headers=auth_header(access_token),
                            json=payload,
                            follow_redirects=True)
    data = verify_api_response(response)

    assert data.get('slug') == team_slug
    members = data.get('members')
    assert members
    member_ids = [m['uniqueId'] for m in members]

    for uid in [u['uniqueId'] for u in users]:
        assert uid in member_ids


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
                        description: str = None,
                        priority: int = None) -> Mapping:
    payload = {
        'shortDescription': short_description,
        'statusUniqueId': status_uuid,
    }

    if description:
        payload['description'] = description

    if priority is not None:
        payload['priority'] = priority

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

    if priority is not None:
        assert data['priority'] == priority
    else:
        assert data['priority'] == 0

    return data


def verify_get_issue(client: FlaskClient,
                     team_slug: str,
                     access_token: str,
                     issue_dto: Mapping):
    issue_uuid = issue_dto['uniqueId']
    response = client.get(f'/teams/{team_slug}/issues/{issue_uuid}',
                          headers=auth_header(access_token),
                          follow_redirects=True)
    issue = verify_api_response(response)

    assert issue['uniqueId'] == issue_uuid
    assert issue['shortDescription'] == issue_dto['shortDescription']
    assert issue['description'] == issue_dto['description']


def verify_delete_issue(client: FlaskClient,
                        team_slug: str,
                        access_token: str,
                        issue_uuid: str):
    del_response = client.delete(f'/teams/{team_slug}/issues/{issue_uuid}',
                                 headers=auth_header(access_token),
                                 follow_redirects=True)

    del_data = verify_api_response(del_response)
    assert del_data['success'] is True

    response = client.get(f'/teams/{team_slug}/issues/{issue_uuid}',
                          headers=auth_header(access_token),
                          follow_redirects=True)
    verify_error_response(response, 404, 'No matching issue')
