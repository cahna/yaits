from graphene import String
from graphene.relay import Node
from graphene_sqlalchemy import SQLAlchemyObjectType
# from graphene_sqlalchemy.types import ORMField
from graphene_sqlalchemy.converter import convert_sqlalchemy_type
from yaits_api.models import User, Team, GUID


@convert_sqlalchemy_type.register(GUID)
def convert_column_to_string(type, column, registry=None):
    return String


class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (Node,)
        exclude_fields = ('hashed_pw',)


class TeamType(SQLAlchemyObjectType):
    class Meta:
        model = Team
        interfaces = (Node,)
