from yaits_api.models import db, JwtBlacklist, User
from yaits_api.extensions import flask_bcrypt
from yaits_api.services.users import username_exists, get_user_by_username
from yaits_api.exceptions.auth import (
    UsernameAlreadyExists,
    LoginBadCredentials,
)


def is_jwt_blacklisted(jti: str) -> bool:
    entry = JwtBlacklist.query.filter_by(jti=jti).first()
    return bool(entry)


def blacklist_jwt(jti: str, user_unique_id: str):
    entry = JwtBlacklist(jti=jti, user_unique_id=user_unique_id)
    db.session.add(entry)
    db.session.commit()


def create_user(username: str, password: str) -> User:
    if username_exists(username):
        raise UsernameAlreadyExists()

    hashed_pw = flask_bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, hashed_pw=hashed_pw)

    db.session.add(new_user)
    db.session.commit()

    return new_user


def login_user(username: str, password: str) -> User:
    user = get_user_by_username(username)

    if not flask_bcrypt.check_password_hash(user.hashed_pw, password):
        raise LoginBadCredentials()

    return user
