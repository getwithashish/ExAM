#!/bin/bash

# Get system IP
SYSTEM_IP=$(hostname -I | awk '{print $1}')

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Error: Could not determine system IP address"
    exit 1
fi

echo "System IP detected as: $SYSTEM_IP"

# Create backup of nginx.conf
NGINX_CONF="nginx.conf"
if [[ -f "$NGINX_CONF" ]]; then
    cp "$NGINX_CONF" "${NGINX_CONF}.backup-$(date +%Y%m%d_%H%M%S)" || {
        echo "Error: Failed to create backup of $NGINX_CONF"
        exit 1
    }
    
    # Create updated nginx configuration
    cat > "$NGINX_CONF" << EOF
worker_processes auto; # Automatically determine the number of worker processes based on available CPU cores

events {
    worker_connections 1024; # Maximum number of simultaneous connections per worker process
}

http {
    server {
        listen 80;
        server_name ${SYSTEM_IP}; # Updated server name with system IP

        # Redirect HTTP traffic to HTTPS
        return 301 https://\$host\$request_uri;
    }

    server {
        listen 443 ssl;
        server_name ${SYSTEM_IP}; # Updated server name with system IP

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/selfsigned.crt;
        ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

        # Optional: Improve SSL security
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

            # CORS headers for frontend
            add_header 'Access-Control-Allow-Origin' '\$http_origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;

            # Handle preflight requests
            if (\$request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '\$http_origin' always;
                add_header 'Access-Control-Allow-Credentials' 'true' always;
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
                add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
        }

        # Backend Proxy
        location /service/ {
            rewrite ^/service(/.*)$ \$1 break;
            proxy_pass http://stage-asset-management-backend-service:8000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;

            # CORS headers for backend
            add_header 'Access-Control-Allow-Origin' '\$http_origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;

            # Handle preflight requests
            if (\$request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '\$http_origin' always;
                add_header 'Access-Control-Allow-Credentials' 'true' always;
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
                add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
            }
        }
    }
}
EOF

    echo "NGINX configuration updated successfully!"
    echo "A backup of the original configuration has been created with timestamp suffix"
    echo "Please restart NGINX to apply the changes:"
    echo "docker compose restart nginx"
else
    echo "Error: NGINX configuration file not found at $NGINX_CONF"
    exit 1
fi