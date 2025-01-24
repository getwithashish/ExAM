#!/bin/bash

ENVIRONMENT=$1
SYSTEM_IP=$2

# Default values for the environment file
DEFAULT_DJANGO_SECRET_KEY="373%1sgr9u57wh6shc@e%7)@9vgy5&ckst9cj2f9p5(ur!1jfl"
DEFAULT_DEBUG_STATUS="True"
DEFAULT_ALLOWED_HOSTS="localhost,127.0.0.1"
#
DEFAULT_DB_NAME="asset_management_db"
DEFAULT_DB_USER="root"
DEFAULT_DB_PORT="3306"
DEFAULT_DB_PASSWORD="experion@123"
DEFAULT_DB_HOST="mysql-db-service"
#
DEFAULT_CELERY_BROKER_URL="redis://localhost:6379/0"
DEFAULT_CELERY_RESULT_BACKEND="redis://localhost:6379/0"
#
DEFAULT_SOCIAL_CALLBACK_URL=https://$SYSTEM_IP/service/api/v1/user/auth/sso/{}
#
DEFAULT_SOCIAL_AUTH_GITHUB_KEY=
DEFAULT_SOCIAL_AUTH_GITHUB_SECRET=
DEFAULT_SOCIAL_AUTH_GITHUB_SCOPE=user,repo
#
DEFAULT_SOCIAL_AUTH_AZUREAD_OAUTH2_KEY=
DEFAULT_SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET=
DEFAULT_AZUREAD_TENANT_ID=13ec0e67-00c5-44c4-8bdb-52adb4a2feae
#
DEFAULT_EMAIL_HOST_USER=
DEFAULT_EMAIL_DOMAIN=
DEFAULT_EMAIL_HOST_PASSWORD=
DEFAULT_EMAIL_PORT=
DEFAULT_EMAIL_USE_TLS=
#
DEFAULT_SENTRY_DSN=https://52ec4419904d628acbe799e7a69a7b14@o4507496029356032.ingest.us.sentry.io/4507496045150208
DEFAULT_HEALTH_CHECK_APP=http://localhost:8000/health/app/
DEFAULT_HEALTH_CHECK_EXTERNAL=http://localhost:8000/health/external/
#
DEFAULT_BACKUP_PARENT_DIR=backup
DEFAULT_FULL_BACKUP_DIR=full_backup
#
DEFAULT_GOOGLE_API_KEY=

# Function to prompt for a value with a default fallback
prompt_value() {
    local prompt_message=$1
    local default_value=$2
    read -p "$prompt_message [$default_value]: " value
    echo "${value:-$default_value}"
}

if [[ -z "$ENVIRONMENT" || -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <environment> <system_ip>"
    echo "Example: $0 Production 192.168.1.1"
    exit 1
fi

BACKEND_DIR="../../exam_django"

if [[ "$ENVIRONMENT" == "Production" ]]; then
    ENV_FILE_NAME=".prod.env"
elif [[ "$ENVIRONMENT" == "Development" ]]; then
    ENV_FILE_NAME=".env"
    DEFAULT_SOCIAL_CALLBACK_URL=http://$SYSTEM_IP:8000/api/v1/user/auth/sso/{}
else
    echo "Invalid environment specified. Use 'Production' or 'Development'."
    exit 1
fi

ENV_FILE_PATH="$BACKEND_DIR/$ENV_FILE_NAME"

# Create or update the environment file
if [[ ! -f "$ENV_FILE_PATH" ]]; then
    echo "Environment file not found for backend. Creating $ENV_FILE_NAME..."
    touch "$ENV_FILE_PATH"

    DJANGO_SECRET_KEY=$(prompt_value "Enter Django secret key" "$DEFAULT_DJANGO_SECRET_KEY")
    DEBUG_STATUS=$(prompt_value "Enter Django debug status" "$DEFAULT_DEBUG_STATUS")
    ALLOWED_HOSTS=$(prompt_value "Enter Allowed hosts (comma-separated)" "$DEFAULT_ALLOWED_HOSTS,$SYSTEM_IP")
    #
    DB_NAME=$(prompt_value "Enter Database name" "$DEFAULT_DB_NAME")
    DB_USER=$(prompt_value "Enter Database user name" "$DEFAULT_DB_USER")
    DB_PORT=$(prompt_value "Enter Database port" "$DEFAULT_DB_PORT")
    DB_PASSWORD=$(prompt_value "Enter Database password" "$DEFAULT_DB_PASSWORD")
    DB_HOST=$(prompt_value "Enter Database host" "$DEFAULT_DB_HOST")
    #
    CELERY_BROKER_URL=$(prompt_value "Enter Celery broker URL" "$DEFAULT_CELERY_BROKER_URL")
    CELERY_RESULT_BACKEND=$(prompt_value "Enter Celery result backend" "$DEFAULT_CELERY_RESULT_BACKEND")
    #
    SOCIAL_CALLBACK_URL=$(prompt_value "Enter Social callback URL" "$DEFAULT_SOCIAL_CALLBACK_URL")
    #
    SOCIAL_AUTH_GITHUB_KEY=$(prompt_value "Enter Github key" "$DEFAULT_SOCIAL_AUTH_GITHUB_KEY")
    SOCIAL_AUTH_GITHUB_SECRET=$(prompt_value "Enter Github secret" "$DEFAULT_SOCIAL_AUTH_GITHUB_SECRET")
    SOCIAL_AUTH_GITHUB_SCOPE=$(prompt_value "Enter Github scopes (comma-separated)" "$DEFAULT_SOCIAL_AUTH_GITHUB_SCOPE")
    #
    SOCIAL_AUTH_AZUREAD_OAUTH2_KEY=$(prompt_value "Enter Azure AD OAuth2 key" "$DEFAULT_SOCIAL_AUTH_AZUREAD_OAUTH2_KEY")
    SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET=$(prompt_value "Enter Azure AD OAuth2 secret" "$DEFAULT_SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET")
    AZUREAD_TENANT_ID=$(prompt_value "Enter Azure AD tenant ID" "$DEFAULT_AZUREAD_TENANT_ID")
    #
    EMAIL_HOST_USER=$(prompt_value "Enter Email host user" "$DEFAULT_EMAIL_HOST_USER")
    EMAIL_DOMAIN=$(prompt_value "Enter Email domain" "$DEFAULT_EMAIL_DOMAIN")
    EMAIL_HOST_PASSWORD=$(prompt_value "Enter Email host password" "$DEFAULT_EMAIL_HOST_PASSWORD")
    EMAIL_PORT=$(prompt_value "Enter Email port" "$DEFAULT_EMAIL_PORT")
    EMAIL_USE_TLS=$(prompt_value "Enter Email TLS status" "$DEFAULT_EMAIL_USE_TLS")
    #
    SENTRY_DSN=$(prompt_value "Enter Sentry DSN" "$DEFAULT_SENTRY_DSN")
    HEALTH_CHECK_APP=$(prompt_value "Enter Health check app URL" "$DEFAULT_HEALTH_CHECK_APP")
    HEALTH_CHECK_EXTERNAL=$(prompt_value "Enter Health check external URL" "$DEFAULT_HEALTH_CHECK_EXTERNAL")
    #
    BACKUP_PARENT_DIR=$(prompt_value "Enter Backup parent directory name" "$DEFAULT_BACKUP_PARENT_DIR")
    FULL_BACKUP_DIR=$(prompt_value "Enter Full Backup directory name" "$DEFAULT_FULL_BACKUP_DIR")
    #
    GOOGLE_API_KEY=$(prompt_value "Enter Google API key" "$DEFAULT_GOOGLE_API_KEY")

    cat <<EOF >"$ENV_FILE_PATH"
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DEBUG_STATUS=$DEBUG_STATUS
ALLOWED_HOSTS=$ALLOWED_HOSTS

DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PORT=$DB_PORT
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST

CELERY_BROKER_URL=$CELERY_BROKER_URL
CELERY_RESULT_BACKEND=$CELERY_RESULT_BACKEND

SOCIAL_CALLBACK_URL=$SOCIAL_CALLBACK_URL

SOCIAL_AUTH_GITHUB_KEY=$SOCIAL_AUTH_GITHUB_KEY
SOCIAL_AUTH_GITHUB_SECRET=$SOCIAL_AUTH_GITHUB_SECRET
SOCIAL_AUTH_GITHUB_SCOPE=$SOCIAL_AUTH_GITHUB_SCOPE

SOCIAL_AUTH_AZUREAD_OAUTH2_KEY=$SOCIAL_AUTH_AZUREAD_OAUTH2_KEY
SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET=$SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET
AZUREAD_TENANT_ID=$AZUREAD_TENANT_ID

EMAIL_HOST_USER=$EMAIL_HOST_USER
EMAIL_DOMAIN=$EMAIL_DOMAIN
EMAIL_HOST_PASSWORD=$EMAIL_HOST_PASSWORD
EMAIL_PORT=$EMAIL_PORT
EMAIL_USE_TLS=$EMAIL_USE_TLS

SENTRY_DSN=$SENTRY_DSN
HEALTH_CHECK_APP=$HEALTH_CHECK_APP
HEALTH_CHECK_EXTERNAL=$HEALTH_CHECK_EXTERNAL

BACKUP_PARENT_DIR=$BACKUP_PARENT_DIR
FULL_BACKUP_DIR=$FULL_BACKUP_DIR

GOOGLE_API_KEY=$GOOGLE_API_KEY

EOF

    echo "$ENV_FILE_NAME successfully created."
    exit 0
else
    echo "Updating $ENV_FILE_NAME..."

    # Update ALLOWED_HOSTS
    sed -i "s/^ALLOWED_HOSTS=.*/ALLOWED_HOSTS=$SYSTEM_IP/" "$ENV_FILE_PATH"

    # Update SOCIAL_CALLBACK_URL
    sed -i "s|^SOCIAL_CALLBACK_URL=.*|SOCIAL_CALLBACK_URL=$DEFAULT_SOCIAL_CALLBACK_URL|" "$ENV_FILE_PATH"

    echo "$ENV_FILE_NAME successfully updated."
    exit 0
fi
