from werkzeug.exceptions import BadRequest


class CreateTeamBadRequest(BadRequest):
    description = 'Bad request'


class CreateTeamBadName(CreateTeamBadRequest):
    description = 'Invalid team name'


class TeamNameAlreadyExists(CreateTeamBadRequest):
    description = 'Team name already exists'


class TeamSlugCollission(CreateTeamBadRequest):
    description = 'Team slug collission'
