from slugify import slugify
from yaits_api.constants import TEAM_SLUG_MAX_LENGTH
from yaits_api.models import db, Team, User
from yaits_api.exceptions.teams import (
    TeamNameAlreadyExists,
    TeamSlugCollission,
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
