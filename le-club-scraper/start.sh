#!/bin/bash
pipenv run celery -A lib worker -l info --autoscale=10,10 --concurrency=10 -n "worker_$HOSTNAME"
