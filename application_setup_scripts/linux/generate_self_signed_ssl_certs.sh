#!/bin/bash

SYSTEM_IP=$1

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Usage: $0 <system_ip>"
    exit 1
fi

if ! command -v openssl &>/dev/null; then
    echo "Error: OpenSSL is not installed. Please install it and try again."
    exit 1
fi

CERT_DIR="../../ssl-certs"

CERT_FILE="$CERT_DIR/selfsigned.crt"
KEY_FILE="$CERT_DIR/selfsigned.key"

if [[ ! -d "$CERT_DIR" ]]; then
    echo "Creating certificates directory: $CERT_DIR"
    mkdir -p "$CERT_DIR" || {
        echo "Error: Failed to create directory $CERT_DIR"
        exit 1
    }
fi

chmod 700 "$CERT_DIR" || {
    echo "Error: Failed to set permissions on $CERT_DIR"
    exit 1
}

# Handle IPv6 address for SYSTEM_IP
if [[ "$SYSTEM_IP" == *:* ]]; then
    SYSTEM_IP="[$SYSTEM_IP]"
fi

echo "Creating self-signed certificate and key for IP: $SYSTEM_IP"

openssl req -x509 -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days 365 \
    -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=$SYSTEM_IP" || {
    echo "Error: Failed to create certificate and key"
    exit 1
}

chmod 600 "$KEY_FILE" || {
    echo "Error: Failed to set permissions on key file"
    exit 1
}

echo "Certificate and key created successfully:"
echo " - Certificate: $CERT_FILE"
echo " - Key: $KEY_FILE"
