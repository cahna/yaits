from marshmallow import validate
from yaits_api.constants import (
    ISSUE_STATUS_MAX_LENGTH,
    ISSUE_STATUS_MIN_LENGTH,
)
from yaits_api.extensions import flask_ma as ma
from yaits_api.models import IssueStatus
from .base import YaitsModelSchema
from .defaults import TEAM_EXCLUDE


class IssueStatusSchema(YaitsModelSchema):
    class Meta:
        model = IssueStatus

    unique_id = ma.auto_field(dump_only=True)
    name = ma.auto_field(required=True, validate=[
        validate.Length(min=ISSUE_STATUS_MIN_LENGTH,
                        max=ISSUE_STATUS_MAX_LENGTH),
    ])
    description = ma.auto_field(default='')
    ordering = ma.auto_field(required=False)
    team = ma.Nested('TeamSchema', exclude=TEAM_EXCLUDE, dump_only=True)
