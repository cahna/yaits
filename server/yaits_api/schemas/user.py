from marshmallow import ValidationError, validate
from yaits_api.constants import (
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_CHARS_WHITELIST,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
)
from yaits_api.extensions import flask_ma as ma
from yaits_api.models import User
from .base import YaitsModelSchema


TEAM_EXCLUDE = ['owner', 'members', 'issue_statuses']
USER_EXCLUDE = ['teams', 'date_created']


def validate_username_text(data):
    if not all(c in USERNAME_CHARS_WHITELIST for c in data):
        raise ValidationError('Invalid username')


class UserAuthSchema(YaitsModelSchema):
    class Meta:
        model = User

    password = ma.String(load_only=True, required=True, validate=[
        validate.Length(min=PASSWORD_MIN_LENGTH, max=PASSWORD_MAX_LENGTH),
    ])
    username = ma.auto_field(required=True, validate=[
        validate.Length(min=USERNAME_MIN_LENGTH, max=USERNAME_MAX_LENGTH),
        validate_username_text,
    ])


class UserSchema(YaitsModelSchema):
    class Meta:
        model = User

    unique_id = ma.auto_field(required=True)
    username = ma.auto_field(required=True, validate=[
        validate.Length(min=USERNAME_MIN_LENGTH, max=USERNAME_MAX_LENGTH),
        validate_username_text,
    ])
    date_created = ma.auto_field(dump_only=True)
    teams = ma.List(ma.Nested('TeamSchema'), dump_only=True)
