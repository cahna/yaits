from flask import Blueprint, jsonify, Response, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from yaits_api.models import Issue
from yaits_api.services import teams, users
from yaits_api.validation.filters import validate_filters
from yaits_api.validation.teams import (
    validate_create_team,
    validate_create_issue_status,
    validate_create_issue,
    validate_manage_team_members,
    validate_update_issue,
)


bp = Blueprint('teams', __name__, url_prefix='/teams')


def authorize_for_team(team_slug: str):
    user_uuid = get_jwt_identity().get('unique_id')
    team, user = teams.verify_user_in_team(team_slug, user_uuid)

    return team, user


@bp.route('', methods=['POST'])
@jwt_required
def create_team() -> Response:
    user_uuid = get_jwt_identity().get('unique_id')
    user = users.get_user_by_id(user_uuid)
    name = validate_create_team(request.get_json())
    team = teams.create_team(name, user)

    return jsonify(team.dto())


@bp.route('/<string:team_slug>', methods=['GET'])
@jwt_required
def get_team_details(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)

    return jsonify(team.dto(with_issue_ids=True))


@bp.route('/<string:team_slug>/members', methods=['PATCH'])
@jwt_required
def manage_team_members(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)
    add_users, remove_users = validate_manage_team_members(request.get_json())

    if add_users:
        teams.add_team_members(team, add_users)
    elif remove_users:
        pass  # TODO

    return jsonify(team.dto())


@bp.route('/<string:team_slug>/issue_statuses', methods=['POST'])
@jwt_required
def create_issue_status(team_slug) -> Response:
    team, user = authorize_for_team(team_slug)
    name, description = validate_create_issue_status(request.get_json())

    issue_status = teams.create_issue_status(name=name,
                                             description=description,
                                             team=team)

    return jsonify(issue_status.dto())


@bp.route('/<string:team_slug>/issues', methods=['POST'])
@jwt_required
def create_issue(team_slug) -> Response:
    team, user = authorize_for_team(team_slug)
    kwargs = validate_create_issue(request.get_json(), team, user)
    issue = teams.create_issue(**kwargs)

    return jsonify(issue.dto())


@bp.route('/<string:team_slug>/issues', methods=['GET'])
@jwt_required
def get_issues(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)
    filters = validate_filters(request, Issue)
    issues = teams.get_issues_for_team(team.id, filters)

    return jsonify({
        'issues': [i.dto() for i in issues],
    })


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>',
          methods=['GET'])
@jwt_required
def delete_issue(team_slug: str, issue_uuid: str) -> Response:
    team, user = authorize_for_team(team_slug)
    issue = teams.get_issue_by_uuid(issue_uuid)

    return jsonify(issue.dto())


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>',
          methods=['DELETE'])
@jwt_required
def get_issue(team_slug: str, issue_uuid: str) -> Response:
    team, user = authorize_for_team(team_slug)
    issue = teams.get_issue_by_uuid(issue_uuid)
    teams.try_delete_issue(issue)

    return jsonify({'success': True})


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>',
          methods=['PATCH'])
@jwt_required
def patch_issue(team_slug: str, issue_uuid: str) -> Response:
    team, user = authorize_for_team(team_slug)
    issue = teams.get_issue_by_uuid(issue_uuid)
    updates = validate_update_issue(request.get_json())
    teams.update_issue(issue, updates)

    return jsonify(issue.dto())


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>/comments',
          methods=['POST'])
@jwt_required
def comment_on_issue(team_slug: str, issue_uuid: str) -> Response:
    # team, user = authorize_for_team(team_slug)

    return jsonify({'TODO': True})


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>/comments',
          methods=['GET'])
@jwt_required
def get_issue_comments(team_slug: str, issue_uuid: str) -> Response:
    # team, user = authorize_for_team(team_slug)

    return jsonify({'TODO': True})
