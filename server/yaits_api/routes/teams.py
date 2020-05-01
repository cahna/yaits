from flask import Blueprint, jsonify, Response, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)
from yaits_api.models import Issue
from yaits_api.schemas import (
    IssueSchema,
    IssueStatusSchema,
    TeamSchema,
    UserSchema,
)
from yaits_api.services import teams, users
from yaits_api.validation.filters import validate_filters


bp = Blueprint('teams', __name__, url_prefix='/teams')
user_schema = UserSchema()
team_schema = TeamSchema()
issue_status_schema = IssueStatusSchema()
issue_schema = IssueSchema()


def authorize_for_team(team_slug: str):
    user_uuid = get_jwt_identity().get('unique_id')
    team, user = teams.verify_user_in_team(team_slug, user_uuid)

    return team, user


@bp.route('', methods=['POST'])
@jwt_required
def create_team() -> Response:
    user_uuid = get_jwt_identity().get('unique_id')
    user = users.get_user_by_id(user_uuid)
    data = team_schema.load(request.get_json())
    team = teams.create_team(data.get('name'), user)

    return team_schema.jsonify(team)


@bp.route('/<string:team_slug>', methods=['GET'])
@jwt_required
def get_team_details(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)

    return team_schema.jsonify(team)


@bp.route('/<string:team_slug>/members', methods=['PATCH'])
@jwt_required
def add_team_members(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)
    users = user_schema.load(request.get_json(), many=True)

    teams.add_team_members(team, [u.get('unique_id') for u in users])

    return team_schema.jsonify(team)


@bp.route('/<string:team_slug>/members', methods=['DELETE'])
@jwt_required
def remove_team_members(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)
    # users = user_schema.load(request.get_json(), many=True)

    # teams.add_team_members(team, [u.get('unique_id') for u in users])

    return team_schema.jsonify(team)


@bp.route('/<string:team_slug>/issue_statuses', methods=['POST'])
@jwt_required
def create_issue_status(team_slug) -> Response:
    team, user = authorize_for_team(team_slug)
    data = issue_status_schema.load(request.get_json())
    issue_status = teams\
        .create_issue_status(name=data.get('name'),
                             description=data.get('description'),
                             team=team)

    return issue_status_schema.jsonify(issue_status)


@bp.route('/<string:team_slug>/issues', methods=['POST'])
@jwt_required
def create_issue(team_slug) -> Response:
    team, user = authorize_for_team(team_slug)
    kwargs = issue_schema.load(request.get_json())
    issue = teams.create_issue(team=team, created_by=user, **kwargs)

    return issue_schema.jsonify(issue)


@bp.route('/<string:team_slug>/issues', methods=['GET'])
@jwt_required
def get_issues(team_slug: str) -> Response:
    team, user = authorize_for_team(team_slug)
    filters = validate_filters(request, Issue)
    issues = teams.get_issues_for_team(team.id, filters)

    return issue_schema.jsonify(issues, many=True)


@bp.route('/<string:team_slug>/issues/<string:issue_uuid>',
          methods=['GET'])
@jwt_required
def delete_issue(team_slug: str, issue_uuid: str) -> Response:
    team, user = authorize_for_team(team_slug)
    issue = teams.get_issue_by_uuid(issue_uuid)

    return issue_schema.jsonify(issue)


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
    updates = issue_schema.load(request.get_json())
    issue = teams.get_issue_by_uuid(issue_uuid)
    teams.update_issue(issue, updates)

    return issue_schema.jsonify(issue)


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
