from typing import List
from yaits_api.models import db, User
from yaits_api.exceptions.users import NoSuchUser


def username_exists(username: str) -> bool:
    return bool(db.session.query(User)
                          .filter_by(username=username).first())


def get_user_by_username(username: str) -> User:
    user = User.query.filter_by(username=username).first()

    if not user:
        raise NoSuchUser()

    return user


def get_user_by_id(unique_id: str) -> User:
    user = User.query.filter_by(unique_id=unique_id).first()

    if not user:
        raise NoSuchUser()

    return user


def get_users(user_ids: List[str]) -> List[User]:
    return db.session.query(User) \
                     .filter(User.username.in_(user_ids)).all()
