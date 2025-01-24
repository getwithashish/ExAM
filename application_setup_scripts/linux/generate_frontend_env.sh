#!/bin/bash

ENVIRONMENT=$1
SYSTEM_IP=$2

if [[ -z "$ENVIRONMENT" || -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <environment> <system_ip>"
    echo "Example: $0 Production 192.168.1.1"
    exit 1
fi

FRONTEND_DIR="../../exam_frontend"

ENV_FILE_NAME=".env"
ENV_FILE_PATH="$FRONTEND_DIR/$ENV_FILE_NAME"

BASE_URL=""
PROTOCOL="http"

if [[ "$ENVIRONMENT" == "Production" ]]; then
    BASE_URL="$SYSTEM_IP/service"
    PROTOCOL="https"
elif [[ "$ENVIRONMENT" == "Development" ]]; then
    BASE_URL="$SYSTEM_IP:8000"
else
    echo "Invalid environment specified. Use 'Production' or 'Development'."
    exit 1
fi

VITE_CONFIG_URL="$PROTOCOL://$BASE_URL/api/v1"
VITE_ADD_ASSET_URL="$PROTOCOL://$BASE_URL/api/v1/asset/"
VITE_MICROSOFT_AD_LOGIN_URL="$PROTOCOL://$BASE_URL/api/v1/user/auth/sso-login/azuread-oauth2"
VITE_GET_ASSET_TYPE="$PROTOCOL://$BASE_URL/api/v1/asset/asset_type"

# Create or update the environment file
if [[ ! -f "$ENV_FILE_PATH" ]]; then
    echo "Environment file not found not found for frontend. Creating $ENV_FILE_NAME..."
    touch "$ENV_FILE_PATH"

    cat <<EOF >"$ENV_FILE_PATH"
VITE_CONFIG_URL=$VITE_CONFIG_URL
VITE_ADD_ASSET_URL=$VITE_ADD_ASSET_URL
VITE_MICROSOFT_AD_LOGIN_URL=$VITE_MICROSOFT_AD_LOGIN_URL
VITE_GET_ASSET_TYPE=$VITE_GET_ASSET_TYPE

EOF

    echo "$ENV_FILE_NAME successfully created."
    exit 0
else
    echo "Updating $ENV_FILE_NAME..."

    sed -i "s|^VITE_CONFIG_URL=.*|VITE_CONFIG_URL=$VITE_CONFIG_URL|" "$ENV_FILE_PATH"
    sed -i "s|^VITE_ADD_ASSET_URL=.*|VITE_ADD_ASSET_URL=$VITE_ADD_ASSET_URL|" "$ENV_FILE_PATH"
    sed -i "s|^VITE_MICROSOFT_AD_LOGIN_URL=.*|VITE_MICROSOFT_AD_LOGIN_URL=$VITE_MICROSOFT_AD_LOGIN_URL|" "$ENV_FILE_PATH"
    sed -i "s|^VITE_GET_ASSET_TYPE=.*|VITE_GET_ASSET_TYPE=$VITE_GET_ASSET_TYPE|" "$ENV_FILE_PATH"

    echo "$ENV_FILE_NAME successfully updated."
    exit 0
fi
