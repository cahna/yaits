from typing import Mapping
import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from yaits_api.constants import (
    USERNAME_MAX_LENGTH,
    UUID_LENGTH,
    TEAM_NAME_MAX_LENGTH,
    TEAM_SLUG_MAX_LENGTH,
    ISSUE_STATUS_MAX_LENGTH,
    ISSUE_SHORT_DESCRIPTION_MAX_LENGTH,
)
from yaits_api.validation.auth import is_valid_username

db = SQLAlchemy()
PK_TYPE = db.BigInteger().with_variant(db.Integer, "sqlite")


class GUID(db.TypeDecorator):
    """
    Platform-independent GUID type.

    Uses PostgreSQL's UUID type, otherwise uses
    CHAR(32), storing as stringified hex values.
    """
    impl = db.CHAR

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(UUID())
        else:
            return dialect.type_descriptor(db.CHAR(UUID_LENGTH))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return "%.32x" % uuid.UUID(value).int
            else:
                return "%.32x" % value.int

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value


class User(db.Model):
    """
    Available backrefs:
        - created_issues
        - assigned_issues
    """
    __tablename__ = 'users'  # 'user' is reserved in postgresql

    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    username = db.Column(db.String(USERNAME_MAX_LENGTH),
                         index=True,
                         unique=True,
                         nullable=False)
    hashed_pw = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    teams = db.relationship('Team', secondary='team_membership')

    @db.validates('created_by', 'assigned_to')
    def validate_username(self, key, _username):
        assert is_valid_username(_username)

    def dto(self, with_teams: bool = True) -> Mapping:
        u = {
            'username': self.username,
            'uniqueId': self.unique_id,
            'dateCreated': self.date_created,
        }

        if with_teams:
            u['teams'] = [t.dto() for t in self.teams]

        return u

    def jwt_identity(self) -> Mapping:
        return {
            'username': self.username,
            'unique_id': self.unique_id,
        }


class JwtBlacklist(db.Model):
    """JTIs in this table are considered revoked"""
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    jti = db.Column(db.String(UUID_LENGTH),
                    unique=True,
                    index=True,
                    nullable=False)
    user_unique_id = db.Column(GUID(),
                               db.ForeignKey('users.unique_id'),
                               nullable=False)
    blacklist_date = db.Column(db.DateTime, default=datetime.utcnow)


class Team(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    name = db.Column(db.String(TEAM_NAME_MAX_LENGTH),
                     index=True,
                     unique=True,
                     nullable=False)
    slug = db.Column(db.String(TEAM_SLUG_MAX_LENGTH),
                     index=True,
                     unique=True,
                     nullable=False)
    owner_id = db.Column(PK_TYPE, db.ForeignKey('users.id'))

    # TODO: Add trigger/validation that owner is a member
    owner = db.relationship('User')
    members = db.relationship('User', secondary='team_membership')

    def dto(self) -> Mapping:
        return {
            'name': self.name,
            'slug': self.slug,
            'owner': self.owner.dto(with_teams=False),
            'members': [u.dto(with_teams=False) for u in self.members],
            'issueStatuses': [s.dto() for s in self.issue_statuses],
        }


class TeamMembership(db.Model):
    team_id = db.Column(PK_TYPE, db.ForeignKey('team.id'), primary_key=True)
    user_id = db.Column(PK_TYPE, db.ForeignKey('users.id'), primary_key=True)


class IssueStatus(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    name = db.Column(db.String(ISSUE_STATUS_MAX_LENGTH),
                     index=True,
                     nullable=False)
    description = db.Column(db.Text)
    ordering = db.Column(db.Integer, nullable=False)
    team_id = db.Column(PK_TYPE,
                        db.ForeignKey('team.id'),
                        nullable=False,
                        index=True)

    team = db.relationship('Team',
                           backref=db.backref('issue_statuses', lazy=True))

    __table_args__ = (
        db.UniqueConstraint('name', 'team_id'),
        db.UniqueConstraint('team_id', 'ordering'),
    )

    def dto(self):
        return {
            'uniqueId': self.unique_id,
            'name': self.name,
            'description': self.description,
            'ordering': self.ordering,
        }


class Issue(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    short_description = db.Column(
        db.String(ISSUE_SHORT_DESCRIPTION_MAX_LENGTH), nullable=False)
    description = db.Column(db.Text, default=str)
    priority = db.Column(db.Integer, nullable=False, index=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, default=datetime.utcnow)
    status_id = db.Column(PK_TYPE,
                          db.ForeignKey('issue_status.id'),
                          nullable=False,
                          index=True)
    team_id = db.Column(PK_TYPE,
                        db.ForeignKey('team.id'),
                        nullable=False,
                        index=True)
    created_by_id = db.Column(PK_TYPE,
                              db.ForeignKey('users.id'),
                              nullable=False,
                              index=True)
    assigned_to_id = db.Column(PK_TYPE,
                               db.ForeignKey('users.id'),
                               nullable=False,
                               index=True)

    status = db.relationship('IssueStatus')
    team = db.relationship('Team', backref=db.backref('issues', lazy=True))
    created_by = db.relationship('User',
                                 foreign_keys=[created_by_id],
                                 backref=db.backref('created_issues',
                                                    lazy=True))
    assigned_to = db.relationship('User',
                                  foreign_keys=[assigned_to_id],
                                  backref=db.backref('assigned_issues',
                                                     lazy=True))

    # TODO: Add triggers/validation that associated users are members of team
    # TODO: Add triggers/validation that IssueStatus belongs to team
    __table_args__ = (
        db.CheckConstraint('date_created <= date_updated'),
        # TODO: Move priority to own table (configurable/team)
        db.CheckConstraint('priority < 10'),
    )

    def dto(self):
        return {
            'uniqueId': self.unique_id,
            'shortDescription': self.short_description,
            'description': self.description,
            'priority': self.priority,
            'dateCreated': self.date_created,
            'dateUpdated': self.date_updated,
            'createdBy': self.created_by.dto(with_teams=False),
            'assignedTo': self.assigned_to.dto(with_teams=False),
            'status': self.status.dto(),
        }


class IssueComment(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    issue_id = db.Column(PK_TYPE, db.ForeignKey('issue.id'), nullable=False)
    user_id = db.Column(PK_TYPE, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    issue = db.relationship('Issue', backref=db.backref('comments', lazy=True))
    user = db.relationship('User')

    def dto(self):
        return {
            'text': self.text,
            'timestamp': self.timestamp,
            'user': self.user.dto(with_teams=False),
        }
