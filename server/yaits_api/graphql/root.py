import graphene
from graphene_sqlalchemy import SQLAlchemyConnectionField
from .types import UserType, TeamType
from .mutations import CreateTeam


class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    current_user = SQLAlchemyConnectionField(UserType)
    users = SQLAlchemyConnectionField(UserType)
    teams = SQLAlchemyConnectionField(TeamType)

    def resolve_teams(root, info):
        return info.context.yaits_user.teams

    def resolve_current_user(root, info):
        return info.context.yaits_user


class Mutation(graphene.ObjectType):
    create_team = CreateTeam.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
