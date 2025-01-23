#!/bin/bash

SYSTEM_IP=$1

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <system_ip>"
    echo "Example: $0 192.168.1.1"
    exit 1
fi

ENV_FILE="exam_frontend/.env"

VITE_CONFIG_URL="https://$SYSTEM_IP/service/api/v1"
VITE_ADD_ASSET_URL="https://$SYSTEM_IP/service/api/v1/asset/"
VITE_MICROSOFT_AD_LOGIN_URL="https://$SYSTEM_IP/service/api/v1/user/auth/sso-login/azuread-oauth2"
VITE_GET_ASSET_TYPE="https://$SYSTEM_IP/service/api/v1/asset/asset_type"

# Create or update the environment file
if [[ ! -f "$ENV_FILE" ]]; then
    echo "Environment file not found not found for frontend. Creating $ENV_FILE..."
    touch "$ENV_FILE"

    cat <<EOF >"$ENV_FILE"
VITE_CONFIG_URL=$VITE_CONFIG_URL
VITE_ADD_ASSET_URL=$VITE_ADD_ASSET_URL
VITE_MICROSOFT_AD_LOGIN_URL=$VITE_MICROSOFT_AD_LOGIN_URL
VITE_GET_ASSET_TYPE=$VITE_GET_ASSET_TYPE

EOF

    echo "$ENV_FILE successfully created."
    exit 0
else
    echo "Updating $ENV_FILE..."

    sed -i "s|^VITE_CONFIG_URL=.*|VITE_CONFIG_URL=$VITE_CONFIG_URL|" "$ENV_FILE"
    sed -i "s|^VITE_ADD_ASSET_URL=.*|VITE_ADD_ASSET_URL=$VITE_ADD_ASSET_URL|" "$ENV_FILE"
    sed -i "s|^VITE_MICROSOFT_AD_LOGIN_URL=.*|VITE_MICROSOFT_AD_LOGIN_URL=$VITE_MICROSOFT_AD_LOGIN_URL|" "$ENV_FILE"
    sed -i "s|^VITE_GET_ASSET_TYPE=.*|VITE_GET_ASSET_TYPE=$VITE_GET_ASSET_TYPE|" "$ENV_FILE"

    echo "$ENV_FILE successfully updated."
    exit 0
fi
