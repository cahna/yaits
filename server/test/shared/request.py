from typing import Mapping


def auth_header(access_token: str) -> Mapping:
    return {
        'Authorization': f'Bearer {access_token}'
    }
