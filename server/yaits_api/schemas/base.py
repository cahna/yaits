from functools import cached_property
from inflection import camelize, pluralize
from marshmallow import SchemaOpts, pre_load, post_dump
from yaits_api.extensions import flask_ma as ma


class EnvelopeOpts(SchemaOpts):
    """Add 'name' and 'plural_name' config for enveloping."""

    def __init__(self, meta, **kwargs):
        self.name = getattr(meta, 'name', None)
        self.plural_name = getattr(meta, 'plural_name', pluralize(self.name))
        SchemaOpts.__init__(self, meta, **kwargs)


class PropertyInflectionMixin:
    def on_bind_field(self, field_name, field_obj):
        """Use camelCase externally and snake_case internally"""
        name = field_obj.data_key or field_name
        field_obj.data_key = camelize(name, uppercase_first_letter=False)


class EnvelopeMixin:
    @pre_load(pass_many=True)
    def _unwrap_envelope(self, data, many, **kwargs):
        return data[self.opts.plural_name] if many else data

    @post_dump(pass_many=True)
    def _wrap_envelope(self, data, many, **kwargs):
        key = self.opts.plural_name if many else self.opts.name
        return {key: data} if many else data


class EnvelopeModelMixin:
    @cached_property
    def _envelope_name(self):
        return getattr(self.Meta, 'name', self.Meta.model.__name__)

    @cached_property
    def _envelope_plural_name(self):
        return camelize(pluralize(getattr(self.Meta,
                                          'plural_name',
                                          self._envelope_name)),
                        uppercase_first_letter=False)

    @pre_load(pass_many=True)
    def _unwrap_envelope(self, data, many, **kwargs):
        return data[self._envelope_plural_name] if many else data

    @post_dump(pass_many=True)
    def _wrap_envelope(self, data, many, **kwargs):
        key = self._envelope_plural_name if many else self._envelope_name
        return {key: data} if many else data


class YaitsSchema(PropertyInflectionMixin, EnvelopeMixin, ma.Schema):
    OPTIONS_CLASS = EnvelopeOpts


class YaitsModelSchema(PropertyInflectionMixin,
                       EnvelopeModelMixin,
                       ma.SQLAlchemySchema):
    pass
