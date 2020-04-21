from flask import Blueprint, jsonify, Response
from flask_jwt_extended import jwt_required
from yaits_api.models import db


bp = Blueprint('health', __name__, url_prefix='/health')


def health_resource(healthy: bool = True, details: str = '') -> Response:
    return jsonify({'healthy': healthy, 'details': details})


@bp.route('', methods=['GET'])
def healthcheck() -> Response:
    return health_resource()


@bp.route('/db', methods=['GET'])
@jwt_required
def db_healthcheck() -> Response:
    status_code = 200
    healthy = True
    details = ''

    try:
        db.session.execute('SELECT 1')
    except Exception as e:
        details = str(e)
        status_code = 500

    return health_resource(healthy, details), status_code
