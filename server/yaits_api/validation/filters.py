from typing import List, Mapping
import json
import inflection
from flask import Request
from flask_sqlalchemy import Model
from yaits_api.exceptions.filters import BadFilters


class FilterOps():
    EQ = 'eq'
    GT = 'gt'
    GTE = 'gte'
    LT = 'lt'
    LTE = 'lte'
    allOps = [EQ, GT, GTE, LT, LTE]


class FilterRequest():
    def __init__(self, field, op, val):
        self.field = field
        self.op = op
        self.val = val


def sanitize_filter(f: Mapping, model: Model) -> FilterRequest:
    filter_defs = model.filters()

    if not all(['field' in f, 'op' in f, 'val' in f]):
        raise BadFilters()

    field_name = inflection.underscore(f.get('field'))

    if field_name not in filter_defs:
        raise BadFilters()

    field_def = filter_defs.get(field_name)

    field = getattr(model, field_name)
    op = f.get('op')
    val = f.get('val')

    if op not in field_def['ops']:
        raise BadFilters()

    if 'parse' in field_def:
        try:
            val = field_def['parse'](val)
        except TypeError:
            raise BadFilters()

    return FilterRequest(field=field, op=op, val=val)


def validate_filters(request: Request, model: Model) -> List[FilterRequest]:
    """
    Query string filters look like:
    ?filter=[{"field":"id","op":"eq","val":"42"}]

    Returns kwargs for .where()
    """
    filters_str = request.args.get('filter', '')

    if not filters_str or not hasattr(model, 'filters'):
        return []

    req_filters = None

    try:
        req_filters = json.loads(filters_str)
    except (json.decoder.JSONDecodeError, TypeError):
        raise BadFilters()

    if not req_filters:
        return []

    if not isinstance(req_filters, List):
        raise BadFilters()

    return list(filter(bool, [
        sanitize_filter(f, model) for f in req_filters
    ]))
