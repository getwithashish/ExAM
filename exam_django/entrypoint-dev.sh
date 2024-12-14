#!/bin/bash

dockerize -wait tcp://mysql-db-service:3306 -timeout 1m
python manage.py migrate
python manage.py create_dummy_assets
python manage.py runserver 0.0.0.0:8000
