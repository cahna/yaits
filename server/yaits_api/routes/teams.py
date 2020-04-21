from flask import Blueprint, jsonify, Response, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from yaits_api.services import teams, users
from yaits_api.validation.teams import validate_create_team


bp = Blueprint('teams', __name__, url_prefix='/teams')


@bp.route('', methods=['POST'])
@jwt_required
def create_team() -> Response:
    identity = get_jwt_identity()
    user = users.get_user_by_id(identity['unique_id'])

    name = validate_create_team(request.get_json())
    team = teams.create_team(name, user)

    return jsonify(team.dto())


# @bp.route('/active_user', methods=['GET'])
# @jwt_required
# def get_active_user() -> Response:
#     identity = get_jwt_identity()
#     user = get_user_by_id(identity['unique_id'])

#     return jsonify(user.dto())
