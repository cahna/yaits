from flask import Blueprint, jsonify, Response, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from yaits_api.services import teams, users
from yaits_api.validation.teams import (
    validate_create_team,
    validate_create_issue_status,
)


bp = Blueprint('teams', __name__, url_prefix='/teams')


@bp.route('', methods=['POST'])
@jwt_required
def create_team() -> Response:
    user_uuid = get_jwt_identity().get('unique_id')
    user = users.get_user_by_id(user_uuid)
    name = validate_create_team(request.get_json())
    team = teams.create_team(name, user)

    return jsonify(team.dto())


@bp.route('/<string:team_slug>/issue_statuses', methods=['POST'])
@jwt_required
def create_issue_status(team_slug) -> Response:
    user_uuid = get_jwt_identity().get('unique_id')
    team, user = teams.verify_user_in_team(team_slug, user_uuid)
    name, description = validate_create_issue_status(request.get_json())

    issue_status = teams.create_issue_status(name=name,
                                             description=description,
                                             team=team)

    return jsonify(issue_status.dto())


# @bp.route('/<string:team_slug>/issues', methods=['POST'])
# @jwt_required
# def create_issue(team_slug) -> Response:
#     user_uuid = get_jwt_identity().get('unique_id')
#     team, user = teams.verify_user_in_team(team_slug, user_uuid)

#     return jsonify(issue.dto())

