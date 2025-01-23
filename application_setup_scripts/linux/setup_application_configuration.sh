#!/bin/bash

# TODO After calling required scripts, spawn up the docker containers according to the production or development

read -p "Enter the environment (Production/Development): " ENVIRONMENT

SYSTEM_IP=$(./obtain_ip.sh)

if [[ $? -ne 0 ]]; then
    echo "Error: Cannot complete obtaining IP Address."
    exit 1
fi

# Create environment file for backend
./generate_backend_env.sh "$ENVIRONMENT" "$SYSTEM_IP"

if [[ $? -ne 0 ]]; then
    echo "Error: Cannot complete creating backend environment file."
    exit 1
fi

# Create environment file for frontend
./generate_frontend_env.sh "$SYSTEM_IP"

if [[ $? -ne 0 ]]; then
    echo "Error: Cannot complete creating frontend environment file."
    exit 1
fi

# Create self-signed SSL certificates
./generate_self_signed_ssl_certs.sh "$SYSTEM_IP"

if [[ $? -ne 0 ]]; then
    echo "Error: Cannot complete creating nginx configuration file."
    exit 1
fi

# Create nginx configuration file
./generate_nginx_config.sh "$SYSTEM_IP"

if [[ $? -ne 0 ]]; then
    echo "Error: Cannot complete creating nginx configuration file."
    exit 1
fi

echo "Successfully created application configuration files."

if [[ "$ENVIRONMENT" == "Production" ]]; then
    echo "Running Docker Compose with stage profile..."
    docker compose --profile stage up
elif [[ "$ENVIRONMENT" == "Development" ]]; then
    echo "Running Docker Compose with development profile..."
    docker compose --profile development up
else
    echo "Error: Unknown environment. Please specify 'Production' or 'Development'."
    exit 1
fi

exit 0
