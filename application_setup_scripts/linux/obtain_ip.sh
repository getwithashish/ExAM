#!/bin/bash

# Function to get IP from a specific interface
get_ip_from_interface() {
    local interface=$1
    ip -4 addr show "$interface" 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -n 1
}

# Get system IP from WiFi (wlan0) or Ethernet (eth0)
SYSTEM_IP=$(get_ip_from_interface "wlan0")

if [[ -z "$SYSTEM_IP" ]]; then
    SYSTEM_IP=$(get_ip_from_interface "eth0")
fi

if [[ -z "$SYSTEM_IP" ]]; then
    echo "Error: Could not determine System IP Address."
    exit 1
fi

read -p "Do you want to use the detected IP Address [$SYSTEM_IP]? (y/n): " choice

if [[ "$choice" =~ ^[Nn]$ ]]; then
    read -p "Please enter a new IP Address: " NEW_IP
    if [[ -z "$NEW_IP" ]]; then
        echo "Error: No IP Address entered. Exiting."
        exit 1
    fi
    SYSTEM_IP="$NEW_IP"
fi

echo "$SYSTEM_IP"
exit 0
