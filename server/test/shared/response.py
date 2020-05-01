from typing import Mapping
from werkzeug.wrappers import Response
from yaits_api.constants import UUID_LENGTH


def verify_api_response(response: Response,
                        status_code: int = 200) -> Mapping:
    assert response.status_code == status_code
    assert response.content_type == 'application/json'

    return response.get_json()


def verify_error_response(response: Response,
                          status_code: int,
                          message: str = None):
    data = verify_api_response(response, status_code)

    if message:
        assert 'errors' in data
        err_msgs = data['errors']
        assert message in err_msgs, \
            f'Expected error: "{message}". Instead got: "{err_msgs}"'


def verify_user_response(response: Response,
                         unique_id: str = None,
                         username: str = None) -> Mapping:
    user_data = verify_api_response(response)

    assert 'username' in user_data
    assert 'uniqueId' in user_data
    assert 'unique_id' not in user_data
    assert 'password' not in user_data
    assert 'hashed_pw' not in user_data
    assert 'hashedPw' not in user_data

    response_unique_id = user_data['uniqueId']
    id_len = len(response_unique_id)

    assert id_len == UUID_LENGTH, \
        f'Expected id_len == {UUID_LENGTH}. Instead got: {id_len}'

    if unique_id:
        assert response_unique_id == unique_id
    if username:
        assert user_data.get('username') == username

    return user_data
