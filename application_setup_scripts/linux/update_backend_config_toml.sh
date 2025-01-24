#!/bin/bash

ENVIRONMENT=$1
SYSTEM_IP=$2

if [[ -z "$ENVIRONMENT" || -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <environment> <system_ip>"
    echo "Example: $0 Production 192.168.1.1"
    exit 1
fi

BACKEND_DIR="../../exam_django"

CONFIG_FILE_NAME="config.toml"
CONFIG_FILE_PATH="$BACKEND_DIR/$CONFIG_FILE_NAME"

if [[ "$ENVIRONMENT" == "Production" ]]; then
    HOSTNAME="https://$SYSTEM_IP"
    REDIRECT_URL="https://$SYSTEM_IP/sso/flow?refresh_token={}&access_token={}"
elif [[ "$ENVIRONMENT" == "Development" ]]; then
    HOSTNAME="http://$SYSTEM_IP:5173"
    REDIRECT_URL="http://$SYSTEM_IP:5173/sso/flow?refresh_token={}&access_token={}"
else
    echo "Invalid environment specified. Use 'Production' or 'Development'."
    exit 1
fi

sed -i "s|^hostname = .*|hostname = \"$HOSTNAME\"|" "$CONFIG_FILE_PATH"
sed -i "s|^redirect_url = .*|redirect_url = \"$REDIRECT_URL\"|" "$CONFIG_FILE_PATH"

echo "$CONFIG_FILE_NAME successfully updated."

exit 0
