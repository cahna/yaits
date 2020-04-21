import os
import logging
from werkzeug.exceptions import HTTPException
from flask import Flask, jsonify
from flask_migrate import Migrate


DEFAULT_DB_URI = 'sqlite:////tmp/yaits.db'

logging.basicConfig(level=logging.DEBUG,
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler()])
logger = logging.getLogger()


def configure_app(app, config_overrides=None):
    from yaits_api.models import db
    from yaits_api.extensions import (
        flask_bcrypt, flask_jwt, configure_jwt
    )

    db_uri = os.getenv('YAITS_DB_URI')
    secret_key = os.getenv('FLASK_SECRET_KEY', 'testkey')

    if app.env == 'production' and not db_uri:
        logger.error('Missing YAITS_DB_URI for production environment!')

    app.config.from_mapping(
        SECRET_KEY=secret_key,
        SQLALCHEMY_DATABASE_URI=db_uri or DEFAULT_DB_URI,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=secret_key,
        JWT_BLACKLIST_ENABLED=True,
        JWT_ERROR_MESSAGE_KEY='error',
        JWT_IDENTITY_CLAIM='sub',
    )

    if config_overrides:
        app.config.from_mapping(config_overrides)

    migrate = Migrate(app, db)
    db.init_app(app)
    migrate.init_app(app, db)

    if app.env != 'production' and not db_uri:  # For debug/testing
        @app.before_first_request
        def setup_sqlite():
            db.create_all()

    flask_bcrypt.init_app(app)
    flask_jwt.init_app(app)
    configure_jwt(flask_jwt)

    logger.info(f'Configured for environment: {app.env}')


def create_app(config_overrides=None) -> Flask:
    logger.info(f'Starting Flask app: {__name__}')

    app = Flask(__name__)
    configure_app(app, config_overrides)

    @app.errorhandler(HTTPException)
    def bad_request(error):
        return jsonify({'error': error.description}), error.code

    from yaits_api.routes import blueprints
    for bp in blueprints:
        app.register_blueprint(bp)

    return app

