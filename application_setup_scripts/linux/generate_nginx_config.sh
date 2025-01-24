#!/bin/bash

SYSTEM_IP=$1

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <system_ip>"
    echo "Example: $0 192.168.1.1"
    exit 1
fi

NGINX_DIR="../.."

NGINX_CONFIG_NAME="nginx.conf"
NGINX_CONFIG_PATH="$NGINX_DIR/$NGINX_CONFIG_NAME"

if [[ ! -f "$NGINX_CONFIG_PATH" ]]; then
    echo "NGINX configuration file not found. Creating $NGINX_CONFIG_NAME..."
    touch "$NGINX_CONFIG_PATH"
fi

# Create/Update the NGINX configuration file
cat > "$NGINX_CONFIG_PATH" << EOF
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name ${SYSTEM_IP};

        return 301 https://\$host\$request_uri;
    }

    server {
        listen 443 ssl;
        server_name ${SYSTEM_IP};

        ssl_certificate /etc/nginx/ssl/selfsigned.crt;
        ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;

        # Frontend Proxy
        location / {
            proxy_pass http://stage-asset-management-frontend-service:4173;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend Proxy
        location /service/ {
            rewrite ^/service(/.*)$ \$1 break;
            proxy_pass http://stage-asset-management-backend-service:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

echo "NGINX configuration updated successfully."

exit 0
