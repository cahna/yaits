from werkzeug.exceptions import BadRequest


class BadFilters(BadRequest):
    description = 'Invalid filters'
