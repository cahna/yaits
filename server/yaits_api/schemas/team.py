from marshmallow import ValidationError, validate
from yaits_api.constants import (
    TEAM_NAME_CHARS_WHITELIST,
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_MIN_LENGTH,
)
from yaits_api.extensions import flask_ma as ma
from yaits_api.models import Team
from .base import YaitsModelSchema
from .defaults import USER_EXCLUDE


def validate_team_name_text(data):
    if not all(c in TEAM_NAME_CHARS_WHITELIST for c in data):
        raise ValidationError('Invalid team name')


class TeamSchema(YaitsModelSchema):
    class Meta:
        model = Team

    name = ma.auto_field(required=True, validate=[
        validate.Length(min=TEAM_NAME_MIN_LENGTH, max=TEAM_NAME_MAX_LENGTH),
        validate_team_name_text,
    ])
    slug = ma.auto_field(dump_only=True)
    owner = ma.Nested('UserSchema', exclude=USER_EXCLUDE, dump_only=True)
    members = ma.List(ma.Nested('UserSchema', exclude=USER_EXCLUDE),
                      dump_only=True)
    issue_statuses = ma.List(ma.Nested('IssueStatusSchema', exclude=['team']),
                             dump_only=True)
