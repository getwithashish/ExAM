from pathlib import Path
from datetime import timedelta

from ms_identity_web.configuration import AADConfig
from ms_identity_web import IdentityWebPython

from celery.schedules import crontab
import sentry_sdk

from utils.decouple_config_util import DecoupleConfigUtil


config = DecoupleConfigUtil.get_env_config()

AAD_CONFIG = AADConfig.parse_json(file_path="aad.config.json")
MS_IDENTITY_WEB = IdentityWebPython(AAD_CONFIG)
# ERROR_TEMPLATE = 'auth/{}.html' # for rendering 401 or other errors from msal_middleware
# MIDDLEWARE.append('ms_identity_web.django.middleware.MsalMiddleware')


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
django_sercret_key = config("DJANGO_SECRET_KEY")
SECRET_KEY = "django-insecure-" + django_sercret_key

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG_STATUS", cast=bool)

# ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS", cast=lambda v: [item.strip() for item in v.split(",")]
)


# CORS_ORIGIN_WHITELIST = config(
#     "CORS_ORIGIN_WHITELIST", cast=lambda v: [item.strip() for item in v.split(",")]
# )

CORS_ALLOW_CREDENTIALS = True

# CORS_ALLOWED_ORIGINS = config(
#     "CORS_ALLOWED_ORIGINS", cast=lambda v: [item.strip() for item in v.split(",")]
# )
CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins


# Redis Configuration
REDIS_URL = config("CELERY_BROKER_URL")

# Celery Configuration
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = config("CELERY_RESULT_BACKEND")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Asia/Kolkata"
CELERY_HEALTH_CHECKS = True

CELERY_BEAT_SCHEDULE = {
    "check-app-health-every-60-seconds": {
        "task": "utils.health_check_tasks.check_application_health",
        "schedule": 60,  # every 1 minute
    },
    "check-external-health-every-5-minutes": {
        "task": "utils.health_check_tasks.check_external_service_health",
        "schedule": 300,  # every 5 minutes
    },
    "full-backup-every-sunday-12-am": {
        "task": "utils.backup_tasks.perform_full_backup",
        "schedule": crontab(
            hour=0, minute=0, day_of_week="sunday"
        ),  # every sunday at 12 am
    },
}

# Django Health Check Configuration
HEALTH_CHECK = {
    "SUBSETS": {
        "app": ["DatabaseBackend", "DefaultFileStorageHealthCheck"],
        "external": ["CeleryHealthCheckCelery", "RedisHealthCheck"],
    }
}

# Sentry Configuration
sentry_sdk.init(
    dsn=config("SENTRY_DSN"),
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # REST framework
    "rest_framework",
    "rest_framework_simplejwt",
    "django_rest_passwordreset",
    "corsheaders",
    "user_auth",
    "asset",
    "ai",
    # Swagger
    "drf_yasg",
    # Django Health Check
    "health_check",
    "health_check.db",
    "health_check.cache",
    "health_check.storage",
    "health_check.contrib.redis",
    "health_check.contrib.celery",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "ms_identity_web.django.middleware.MsalMiddleware",
]

ROOT_URLCONF = "exam_django.urls"

AUTH_USER_MODEL = "user_auth.User"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

SIMPLE_JWT = {
    "REFRESH_TOKEN_LIFETIME": timedelta(days=15),
    "ROTATE_REFRESH_TOKENS": True,
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=720),
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}


WSGI_APPLICATION = "exam_django.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT"),
        
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Email Settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")
EMAIL_PORT = config("EMAIL_PORT")
EMAIL_USE_TLS = config("EMAIL_USE_TLS")
