import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

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
            return dialect.type_descriptor(db.CHAR(32))

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
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    username = db.Column(db.String(64),
                         index=True,
                         unique=True,
                         nullable=False)
    hashed_pw = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    teams = db.relationship('Team', secondary='TeamMembership')

    def dto(self):
        return {
            'username': self.username,
            'uniqueId': self.unique_id,
            'dateCreated': self.date_created,
        }

    def jwt_identity(self):
        return {
            'username': self.username,
            'unique_id': self.unique_id,
        }


class JwtBlacklist(db.Model):
    """JTIs in this table are considered revoked"""
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    jti = db.Column(db.String(36), unique=True, index=True, nullable=False)
    user_unique_id = db.Column(GUID(),
                               db.ForeignKey('user.unique_id'),
                               nullable=False)
    blacklist_date = db.Column(db.DateTime, default=datetime.utcnow)


class Team(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    name = db.Column(db.String(32),
                     index=True,
                     unique=True,
                     nullable=False)
    slug = db.Column(db.String(32),
                     index=True,
                     unique=True,
                     nullable=False)

    members = db.relationship('User', secondary='TeamMembership')


class TeamMembership(db.Model):
    team_id = db.Column(PK_TYPE, db.ForeignKey('team.id'), primary_key=True)
    user_id = db.Column(PK_TYPE, db.ForeignKey('user.id'), primary_key=True)


class IssueStatus(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    name = db.Column(db.String(16),
                     index=True,
                     unique=True,
                     nullable=False)
    description = db.Column(db.Text)
    team_id = db.Column(PK_TYPE, db.ForeignKey('team.id'), nullable=False, index=True)


class Issue(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    unique_id = db.Column(GUID(),
                          nullable=False,
                          unique=True,
                          default=uuid.uuid4)
    short_description = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text, default=str)
    priority = db.Column(db.Integer, nullable=False, index=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, default=datetime.utcnow)
    status_id = db.Column(PK_TYPE, db.ForeignKey('issuestatus.id'), nullable=False, index=True)

    status = db.relationship('IssueStatus')
    team = db.relationship('Team', backref=db.backref('issues', lazy=True))
    created_by = db.relationship('User',
                                 backref=db.backref('created_issues', lazy=True))
    assigned_to = db.relationship('User',
                                  backref=db.backref('assigned_issues', lazy=True))

    @db.validates('created_by', 'assigned_to')
    def validate_users_in_team(self, key, _user):
        assert _user.team.id == self.team.id

    @db.validates('status')
    def validate_status_team(self, key, _status):
        assert _status.team_id == self.team.id

    __table_args__ = (
        db.CheckConstraint('date_created <= date_updated'),
        db.CheckConstraint('priority < 10'),
    )


class IssueComment(db.Model):
    id = db.Column(PK_TYPE, primary_key=True, autoincrement=True)
    issue_id = db.Column(PK_TYPE, db.ForeignKey('issue.id'), nullable=False)
    user_id = db.Column(PK_TYPE, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    issue = db.relationship('Issue', backref=db.backref('comments', lazy=True))
    user = db.relationship('User')

    @db.validates('issue')
    def validate_users_in_team(self, key, _issue):
        assert _issue.team.id == self.user.team.id

    @db.validates('user')
    def validate_users_in_team(self, key, _user):
        assert _user.team.id == self.issue.team.id
