#!/bin/sh
set -eu

python manage.py migrate --noinput
python manage.py ensure_superuser
python manage.py collectstatic --noinput

exec "$@"