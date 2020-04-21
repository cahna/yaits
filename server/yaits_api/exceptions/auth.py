from werkzeug.exceptions import HTTPException, BadRequest


class ActionForbidden(HTTPException):
    code = 403
    description = 'Action Forbidden'


class UsernameAlreadyExists(HTTPException):
    code = 409
    description = 'Username already exists'


class CreateUserBadRequest(BadRequest):
    description = 'Bad request'


class CreateUserBadUsername(CreateUserBadRequest):
    description = 'Invalid username'


class CreateUserBadPassword(CreateUserBadRequest):
    description = 'Invalid password'


class LoginBadCredentials(BadRequest):
    description = 'Bad credentials'
