#!/bin/sh

DJANGO_SETTINGS_MODULE="exam_django.settings"

# Directory to store pid files and logs
RUN_DIR="/run/celery"
LOG_DIR="/var/log/celery"

mkdir -p $RUN_DIR $LOG_DIR
chmod 755 $RUN_DIR $LOG_DIR

# Celery worker service script
cat <<EOF > $RUN_DIR/celery_worker.sh
#!/bin/sh

echo "Starting Celery Worker..."
# Celery worker command
celery -A exam_django worker --pool=solo --loglevel=info --pidfile=$RUN_DIR/worker.pid >> $LOG_DIR/worker.log 2>&1 &
EOF

chmod +x $RUN_DIR/celery_worker.sh

# Celery beat service script
cat <<EOF > $RUN_DIR/celery_beat.sh
#!/bin/sh

echo "Starting Celery Beat..."
# Celery beat command
celery -A exam_django beat --loglevel=info --pidfile=$RUN_DIR/beat.pid >> $LOG_DIR/beat.log 2>&1 &
EOF

chmod +x $RUN_DIR/celery_beat.sh

sh $RUN_DIR/celery_worker.sh
sh $RUN_DIR/celery_beat.sh
