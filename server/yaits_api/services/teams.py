from typing import List
from slugify import slugify
from yaits_api.constants import TEAM_SLUG_MAX_LENGTH
from yaits_api.models import db, Team, User, IssueStatus
from yaits_api.services.users import get_user_by_id
from yaits_api.exceptions.auth import ActionForbidden
from yaits_api.exceptions.teams import (
    TeamNameAlreadyExists,
    TeamSlugCollission,
    NoSuchTeam,
    IssueStatusAlreadyExists,
)


def team_name_exists(team_name: str) -> bool:
    return bool(db.session.query(Team)
                .filter_by(name=team_name).first())


def team_slug_exists(team_slug: str) -> bool:
    return bool(db.session.query(Team)
                .filter_by(slug=team_slug).first())


def create_team(team_name: str, creator: User) -> Team:
    if team_name_exists(team_name):
        raise TeamNameAlreadyExists()

    team_slug = slugify(team_name, max_length=TEAM_SLUG_MAX_LENGTH)

    if team_slug_exists(team_slug):
        raise TeamSlugCollission()

    new_team = Team(name=team_name,
                    slug=team_slug,
                    members=[creator],
                    owner_id=creator.id)

    db.session.add(new_team)
    db.session.commit()

    return new_team


def get_team_by_slug(team_slug: str) -> User:
    team = Team.query.filter_by(slug=team_slug).first()

    if not team:
        raise NoSuchTeam()

    return team


def verify_user_in_team(team_slug: str, user_uuid: str) -> List:
    """If valid, return [Team, User]"""
    team = get_team_by_slug(team_slug)
    user = get_user_by_id(user_uuid)

    if team_slug not in [t.slug for t in user.teams]:
        raise ActionForbidden()

    return team, user


def issue_status_name_exists(status_name: str, team: Team) -> bool:
    return bool(db.session.query(IssueStatus)
                .filter_by(name=status_name, team_id=team.id).first())


def create_issue_status(name: str,
                        description: str,
                        team: Team) -> Team:
    if issue_status_name_exists(name, team):
        raise IssueStatusAlreadyExists()

    ordering = 0
    existing_statuses = db.session.query(IssueStatus) \
        .filter_by(team_id=team.id).all()

    if existing_statuses:
        ordering = max([s.ordering for s in existing_statuses]) + 1

    issue_status = IssueStatus(name=name,
                               description=description,
                               ordering=ordering,
                               team_id=team.id)

    db.session.add(issue_status)
    db.session.commit()

    return issue_status
