from typing import List
from slugify import slugify
from yaits_api.constants import TEAM_SLUG_MAX_LENGTH
from yaits_api.models import db, Team, User, IssueStatus, Issue
from yaits_api.services.users import get_user_by_id
from yaits_api.exceptions.auth import ActionForbidden
from yaits_api.exceptions.teams import (
    TeamNameAlreadyExists,
    TeamSlugCollission,
    NoSuchTeam,
    IssueStatusAlreadyExists,
    CreateIssueUnprocessable,
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

    # Hard-coding these for now. TODO: Allow configuring via API/UI
    for i, name in enumerate([
        'New',
        'Ready',
        'Active',
        'Paused',
        'Complete',
        'Closed',
    ]):
        db.session.add(IssueStatus(
            name=name,
            description=name,
            ordering=i,
            team_id=new_team.id))

    db.session.commit()

    return new_team


def get_team_by_slug(team_slug: str) -> User:
    team = Team.query.filter_by(slug=team_slug).first()

    if not team:
        raise NoSuchTeam()

    return team


def verify_user_in_team(team_slug: str, user_uuid: str) -> List:
    """If valid, return [Team, User]
    TODO: Refactor into Flask route decorator
    """
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
    existing_statuses = db.session.query(IssueStatus)\
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


def get_issue_status_by_uuid(status_uuid: str) -> IssueStatus:
    return db.session.query(IssueStatus)\
        .filter_by(unique_id=status_uuid).first()


def create_issue(short_description: str,
                 description: str,
                 status_uuid: str,
                 team: Team,
                 created_by: User,
                 assigned_to_uuid: str = None,
                 priority: int = 0) -> Issue:
    status = get_issue_status_by_uuid(status_uuid)

    if not status:
        raise CreateIssueUnprocessable('No such status')

    if status.team_id != team.id:
        raise CreateIssueUnprocessable('Invalid status')

    assigned_to_user = created_by

    if assigned_to_uuid:
        assigned_to_user = get_user_by_id(assigned_to_uuid)

    issue = Issue(short_description=short_description,
                  description=description,
                  status_id=status.id,
                  team_id=team.id,
                  created_by_id=created_by.id,
                  assigned_to_id=assigned_to_user.id,
                  priority=priority)

    db.session.add(issue)
    db.session.commit()

    return issue


def get_issues_for_team(team_id) -> List[Issue]:
    return db.session.query(Issue)\
        .filter_by(team_id=team_id).all()

