from marshmallow import ValidationError, validate
from yaits_api.constants import (
    ISSUE_SHORT_DESCRIPTION_MAX_LENGTH,
    ISSUE_SHORT_DESCRIPTION_MIN_LENGTH,
    UUID_LENGTH,
)
from yaits_api.extensions import flask_ma as ma
from yaits_api.models import Issue
from .base import YaitsModelSchema
from .defaults import TEAM_EXCLUDE, USER_EXCLUDE


def validate_issue_priority(data):
    if not isinstance(data, int) or not 0 <= data < 10:
        raise ValidationError('Invalid priority')


def validate_uuid(data):
    if data and len(data) != UUID_LENGTH:
        raise ValidationError('Invalid uuid')


class IssueSchema(YaitsModelSchema):
    class Meta:
        model = Issue

    unique_id = ma.auto_field(dump_only=True)
    short_description = ma.auto_field(required=True, validate=[
        validate.Length(min=ISSUE_SHORT_DESCRIPTION_MIN_LENGTH,
                        max=ISSUE_SHORT_DESCRIPTION_MAX_LENGTH),
    ])
    description = ma.auto_field()
    priority = ma.auto_field(required=False, validate=[
                             validate_issue_priority,
                             ])
    date_created = ma.auto_field(dump_only=True)
    date_updated = ma.auto_field(dump_only=True)
    status = ma.Nested('IssueStatusSchema', exclude=['team'], dump_only=True)
    team = ma.Nested('TeamSchema', exclude=TEAM_EXCLUDE, dump_only=True)
    created_by = ma.Nested('UserSchema', exclude=USER_EXCLUDE, dump_only=True)
    assigned_to = ma.Nested('UserSchema', exclude=USER_EXCLUDE, dump_only=True)

    status_unique_id = ma.Str(required=True,
                              load_only=True,
                              validate=[validate_uuid])
    assigned_to_unique_id = ma.Str(load_only=True,
                                   validate=[validate_uuid])
