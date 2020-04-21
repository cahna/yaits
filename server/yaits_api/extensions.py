from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


flask_bcrypt = Bcrypt()
flask_jwt = JWTManager()


def configure_jwt(jwt: JWTManager):
    from yaits_api.services.auth import is_jwt_blacklisted

    @jwt.token_in_blacklist_loader
    def is_token_in_blacklist(decrypted_token):
        return is_jwt_blacklisted(decrypted_token.get('jti'))
