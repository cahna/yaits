import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene_sqlalchemy.converter import convert_sqlalchemy_type
from yaits_api.models import GUID, User, Team, IssueStatus, Issue
from yaits_api.services.users import get_user_by_id
from yaits_api.services.teams import get_team_by_slug


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

    @classmethod
    def get_node(parent, info, id):
        return get_user_by_id(id)


class TeamType(SQLAlchemyObjectType):
    class Meta:
        model = Team
        interfaces = (graphene.relay.Node,)

    id = graphene.ID(required=True)

    @staticmethod
    def resolve_id(parent, info):
        return parent.slug

    @classmethod
    def get_node(parent, info, id):
        return get_team_by_slug(id)


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
