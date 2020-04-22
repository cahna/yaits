from werkzeug.exceptions import BadRequest, NotFound, HTTPException


class NoSuchTeam(NotFound):
    description = 'No matching team'


class CreateTeamBadRequest(BadRequest):
    description = 'Bad request'


class CreateTeamBadName(CreateTeamBadRequest):
    description = 'Invalid team name'


class TeamNameAlreadyExists(HTTPException):
    code = 409
    description = 'Team name already exists'


class TeamSlugCollission(HTTPException):
    code = 409
    description = 'Team slug collission'


class CreateIssueStatusBadRequest(BadRequest):
    pass


class CreateIssueStatusBadName(CreateIssueStatusBadRequest):
    description = 'Invalid name'


class CreateIssueStatusBadDescription(CreateIssueStatusBadRequest):
    description = 'Invalid description'


class IssueStatusAlreadyExists(HTTPException):
    code = 409
    description = 'Status already exists'


class CreateIssueBadRequest(BadRequest):
    pass


class CreateIssueUnprocessable(HTTPException):
    code = 409
    description = 'Unprocessable request'
