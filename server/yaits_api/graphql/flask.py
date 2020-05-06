from flask import Flask
from flask_graphql import GraphQLView
from flask_jwt_extended import jwt_required, get_jwt_identity
from .root import schema


def configure_graphql(app: Flask):
    from yaits_api.services.users import get_user_by_id

    class FlaskAuthorizationMiddleware(object):
        def resolve(self, next, root, info, **kwargs):
            identity = get_jwt_identity()
            user = get_user_by_id(identity['unique_id'])
            info.context.yaits_user = user
            return next(root, info, **kwargs)

    graphql_view = jwt_required(GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True,
        middleware=[FlaskAuthorizationMiddleware()],
    ))

    app.add_url_rule('/graphql',
                     view_func=graphql_view,
                     methods=['POST', 'GET'])
