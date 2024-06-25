from exam_django.celery import app


class CeleryStatusChecker:

    @staticmethod
    def check_celery_status():
        try:
            ping = app.control.ping()
            if len(ping) != 0:
                return True
        except Exception:
            pass
        return False
