from __future__ import annotations
import os
import pytest
import tempfile
from flask import Flask
from flask.testing import FlaskClient
from yaits_api import create_app
from yaits_api.models import db


@pytest.fixture
def test_app() -> Flask:
    fd, db_file = tempfile.mkstemp()
    config = {
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_file}',
        'TESTING': True,
    }
    test_app = create_app(config)

    yield test_app

    os.close(fd)
    os.unlink(db_file)


@pytest.fixture
def client(test_app: Flask) -> FlaskClient:
    with test_app.app_context():
        db.create_all()

    yield test_app.test_client()

    with test_app.app_context():
        db.drop_all()
