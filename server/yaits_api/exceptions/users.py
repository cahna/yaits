from werkzeug.exceptions import NotFound


class NoSuchUser(NotFound):
    description = 'No such user'
