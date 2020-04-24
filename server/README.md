# `yaits_api`

## Usage

See `yaits_api.apib` for API documentation.

## Development

### Local Setup

```
# Get code
git clone https://github.com/cahna/yaits
cd yaits/server

# Setup virtualenv for development
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup editable local imports for development
pip install -e .

# Configure environment
export FLASK_APP=yaits_api
export FLASK_ENV=development
```

### Test

```
pytest -v
# OR:
python setup.py test
```

Code coverage:

```
coverage run -m pytest
coverage report
```

Lint:

```
flake8
```

### Run development server

```
flask run
```

### PostgreSQL for Development

By default, SQLite is used for development (SQLite is currently used for tests).
To use a PostgreSQL container for development:

```
# Start a postgres container:
docker run -d --name postgres-yaits -p 5432:5432 -e POSTGRES_USER=yaits -e POSTGRES_PASSWORD=yaits postgres:12

# Set environment variable to configure connection:
export YAITS_DB_URI=postgresql://yaits:yaits@localhost:5432/yaits
```

## DB Migrations

Must be run manually until automation configured.

1. `flask db init` : Enable migrations support
2. `flask db migrate` : Create first migration (commit changes to VCS)
3. `flask db upgrade` : Apply migration

## TODO/TBD

- Replace calls to `yaits_api.services.teams.verify_user_in_team()` with a JWT claim.
- Add SQL triggers/constraints to enforce data model rules/permissions
- Websocket service
