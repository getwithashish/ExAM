from decouple import config

FROM_EMAIL = config("EMAIL_HOST_USER")
