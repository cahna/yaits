import graphene
from graphene_sqlalchemy import SQLAlchemyConnectionField
from yaits_api.services import users, teams
from .types import UserType, TeamType, IssueStatusType, IssueType
from .mutations import CreateTeam


class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    current_user = graphene.Field(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    team = graphene.Field(TeamType, slug=graphene.ID(required=True))

    users = SQLAlchemyConnectionField(UserType)
    teams = SQLAlchemyConnectionField(TeamType)
    issue_statuses = SQLAlchemyConnectionField(IssueStatusType)
    issues = SQLAlchemyConnectionField(IssueType)

    def resolve_current_user(root, info):
        return info.context.yaits_user

    def resolve_user(root, info, id):
        return users.get_user_by_id(id)

    def resolve_team(root, info, slug):
        return teams.get_team_by_slug(slug)


class Mutation(graphene.ObjectType):
    create_team = CreateTeam.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
