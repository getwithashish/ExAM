#!/bin/bash

dockerize -wait tcp://mysql-db-service:3306 -timeout 1m
dockerize -wait tcp://redis-service:6379 -timeout 1m
chmod +x ./daemonize-celery.sh
sh ./daemonize-celery.sh
python manage.py migrate
gunicorn --bind 0.0.0.0:8000 --timeout 120 exam_django.wsgi:application
