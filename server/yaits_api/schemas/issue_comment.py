from yaits_api.extensions import flask_ma as ma
from yaits_api.models import IssueComment
from .base import YaitsModelSchema
from .defaults import USER_EXCLUDE


class IssueCommentSchema(YaitsModelSchema):
    class Meta:
        model = IssueComment

    timestamp = ma.auto_field(dump_only=True)
    text = ma.auto_field(required=True)
    issue = ma.Nested('IssueSchema', dump_only=True)
    user = ma.Nested('UserSchema', exclude=USER_EXCLUDE, dump_only=True)

