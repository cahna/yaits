import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene_sqlalchemy.converter import convert_sqlalchemy_type
from yaits_api.models import GUID, User, Team, IssueStatus, Issue


@convert_sqlalchemy_type.register(GUID)
def convert_column_to_string(type, column, registry=None):
    return graphene.String


class BaseType(SQLAlchemyObjectType):
    class Meta:
        abstract = True

    id = graphene.ID(required=True)
    unique_id = id

    @staticmethod
    def resolve_id(parent, info):
        return parent.unique_id


class UserType(BaseType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)
        exclude_fields = ('hashed_pw',)


class TeamType(SQLAlchemyObjectType):
    class Meta:
        model = Team
        interfaces = (graphene.relay.Node,)

    id = graphene.ID(required=True)

    @staticmethod
    def resolve_id(parent, info):
        return parent.slug


class IssueStatusType(BaseType):
    class Meta:
        model = IssueStatus
        interfaces = (graphene.relay.Node,)
        exclude_fields = ('team_id',)


class IssueType(BaseType):
    class Meta:
        model = Issue
        interfaces = (graphene.relay.Node,)
        exclude_fields = (
            'team_id',
            'created_by_id',
            'assigned_to_id',
            'status_id',
        )
