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

    def dto(self):
        return {
            'username': self.username,
            'uniqueId': self.unique_id,
            'dateCreated': self.date_created,
            'teams': [t.slug for t in self.teams],
        }

    def jwt_identity(self):
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

    owner = db.relationship('User')
    members = db.relationship('User', secondary='team_membership')


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
                     unique=True,
                     nullable=False)
    description = db.Column(db.Text)
    team_id = db.Column(PK_TYPE,
                        db.ForeignKey('team.id'),
                        nullable=False,
                        index=True)


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

    @db.validates('created_by', 'assigned_to')
    def validate_users_in_team(self, key, _user):
        assert _user.team.id == self.team.id

    @db.validates('status')
    def validate_status_in_team(self, key, _status):
        assert _status.team_id == self.team.id

    __table_args__ = (
        db.CheckConstraint('date_created <= date_updated'),
        # TODO: Move priority to own table (configurable/team)
        db.CheckConstraint('priority < 10'),
    )


class IssueComment(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    issue_id = db.Column(PK_TYPE, db.ForeignKey('issue.id'), nullable=False)
    user_id = db.Column(PK_TYPE, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    issue = db.relationship('Issue', backref=db.backref('comments', lazy=True))
    user = db.relationship('User')

    @db.validates('issue')  # Is this better as a TRIGGER? IDK...
    def validate_issue_in_team(self, key, _issue):
        assert _issue.team.id == self.user.team.id

    @db.validates('user')
    def validate_users_in_team(self, key, _user):
        assert _user.team.id == self.issue.team.id
