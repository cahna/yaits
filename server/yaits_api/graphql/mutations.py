import graphene
from yaits_api.models import User
from yaits_api.services.teams import create_team
from .types import TeamType


class CreateTeam(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    team = graphene.Field(lambda: TeamType)

    def mutate(self, info, name: str, user: User):
        user = info.context.yaits_user
        new_team = create_team(name, user)
        return CreateTeam(team=new_team)
