#!/bin/bash

# Get system IP
SYSTEM_IP=$(hostname -I | awk '{print $1}')

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Error: Could not determine system IP address"
    exit 1
fi

echo "System IP detected as: $SYSTEM_IP"

# Backup function
create_backup() {
    local file="$1"
    cp "$file" "${file}.backup-$(date +%Y%m%d_%H%M%S)" || {
        echo "Error: Failed to create backup of $file"
        exit 1
    }
}

# Update Django .prod.env
DJANGO_ENV="exam_django/.prod.env"
if [[ -f "$DJANGO_ENV" ]]; then
    echo "Updating Django environment file..."
    create_backup "$DJANGO_ENV"
    
    # Update ALLOWED_HOSTS
    sed -i "s/ALLOWED_HOSTS=.*/ALLOWED_HOSTS=localhost,127.0.0.1,$SYSTEM_IP/" "$DJANGO_ENV"
    
    # Update CORS_ORIGIN_WHITELIST and CORS_ALLOWED_ORIGINS
    sed -i "s|CORS_ORIGIN_WHITELIST=.*|CORS_ORIGIN_WHITELIST=http://localhost:5173,http://$SYSTEM_IP:5173|" "$DJANGO_ENV"
    sed -i "s|CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=http://localhost:5173,http://$SYSTEM_IP:5173|" "$DJANGO_ENV"
    
    # Update SOCIAL_CALLBACK_URL
    sed -i "s|SOCIAL_CALLBACK_URL=.*|SOCIAL_CALLBACK_URL=https://$SYSTEM_IP/service/api/v1/user/auth/sso/{}|" "$DJANGO_ENV"
    
    # Update health check URLs
    sed -i "s|HEALTH_CHECK_APP=.*|HEALTH_CHECK_APP=http://$SYSTEM_IP:8000/health/app/|" "$DJANGO_ENV"
    sed -i "s|HEALTH_CHECK_EXTERNAL=.*|HEALTH_CHECK_EXTERNAL=http://$SYSTEM_IP:8000/health/external/|" "$DJANGO_ENV"
else
    echo "Warning: Django environment file not found at $DJANGO_ENV"
fi

# Update Frontend .env
FRONTEND_ENV="exam_frontend/.env"
if [[ -f "$FRONTEND_ENV" ]]; then
    echo "Updating Frontend environment file..."
    create_backup "$FRONTEND_ENV"
    
    # Update frontend URLs
    sed -i "s|VITE_CONFIG_URL=.*|VITE_CONFIG_URL=https://$SYSTEM_IP/service/api/v1|" "$FRONTEND_ENV"
    sed -i "s|VITE_ADD_ASSET_URL=.*|VITE_ADD_ASSET_URL=https://$SYSTEM_IP/service/api/v1/asset/|" "$FRONTEND_ENV"
    sed -i "s|VITE_MICROSOFT_AD_LOGIN_URL=.*|VITE_MICROSOFT_AD_LOGIN_URL=https://$SYSTEM_IP/service/api/v1/user/auth/sso-login/azuread-oauth2|" "$FRONTEND_ENV"
    sed -i "s|VITE_GET_ASSET_TYPE=.*|VITE_GET_ASSET_TYPE=https://$SYSTEM_IP/service/api/v1/asset/asset_type|" "$FRONTEND_ENV"
else
    echo "Warning: Frontend environment file not found at $FRONTEND_ENV"
fi

echo "Configuration update completed!"
echo "Please review the changes in both environment files"
echo "Backups have been created with timestamp suffix"