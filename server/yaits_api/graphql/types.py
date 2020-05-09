import graphene


class GuidNode(graphene.relay.Node):
    id = graphene.ID(required=True)

    @staticmethod
    def resolve_id(parent, info):
        return parent.unique_id


class UserType(graphene.ObjectType):
    class Meta:
        interfaces = (GuidNode,)

    username = graphene.String()
    date_created = graphene.types.datetime.DateTime()
    teams = graphene.List(lambda: TeamType)


class TeamType(graphene.ObjectType):
    class Meta:
        interfaces = (graphene.relay.Node,)

    id = graphene.ID(required=True)
    slug = id
    name = graphene.String()

    @staticmethod
    def resolve_id(parent, info):
        return parent.slug
