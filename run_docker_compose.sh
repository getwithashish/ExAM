#!/bin/bash

# Directory setup using relative path
CERT_DIR="./ssl-certs"
CERT_FILE="$CERT_DIR/selfsigned.crt"
KEY_FILE="$CERT_DIR/selfsigned.key"

# Create certificates directory if it doesn't exist
if [[ ! -d "$CERT_DIR" ]]; then
    echo "Creating certificates directory: $CERT_DIR"
    mkdir -p "$CERT_DIR" || {
        echo "Error: Failed to create directory $CERT_DIR"
        exit 1
    }
fi

# Ensure proper permissions on the directory
chmod 700 "$CERT_DIR" || {
    echo "Error: Failed to set permissions on $CERT_DIR"
    exit 1
}

# Find the system's IP address (IPv4, excluding localhost and Docker's default bridge IP)
SYSTEM_IP=$(hostname -I | awk '{print $1}') # Gets the first non-local IP address

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Error: Could not determine system IP address"
    exit 1
fi

# Check if the certificate and key already exist
if [[ ! -f "$CERT_FILE" || ! -f "$KEY_FILE" ]]; then
    echo "Generating self-signed certificate and key for IP: $SYSTEM_IP"
    
    # Generate the self-signed certificate and private key
    openssl req -x509 -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -days 365 \
        -nodes \
        -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=$SYSTEM_IP" || {
            echo "Error: Failed to generate certificate and key"
            exit 1
        }
    
    # Set proper permissions for the key file
    chmod 600 "$KEY_FILE" || {
        echo "Error: Failed to set permissions on key file"
        exit 1
    }
    
    echo "Certificate and key generated successfully:"
    echo " - Certificate: $CERT_FILE"
    echo " - Key: $KEY_FILE"
else
    echo "Certificate and key already exist. Skipping generation."
fi

./ip_setup.sh 
./nginx_setup.sh

# Start the main process
docker compose --profile stage up