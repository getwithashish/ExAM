from celery import shared_task


@shared_task
def check_application_health():
    pass


@shared_task
def check_external_service_health():
    pass
