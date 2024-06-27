#!/bin/bash

echo "================="
echo "Starting Stage Deploy Script"
echo "================="

echo "================="
echo "Update"
echo "================="
sudo apt-get update -y

echo "================="
echo "Upgrade"
echo "================="
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg

echo "================="
echo "Get docker compose version"
echo "================="
docker compose version


if [ $? -ne 0 ]
then
    echo "Docker Compose does not exit"
    
    echo "================="
    echo "Install docker and docker compose"
    echo "================="
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

echo "================="
echo "Docker compose up by building in detached mode"
echo "================="
sudo docker compose --profile stage up --build --detach

echo "================="
echo "Successfully executed Stage Deploy Script"
echo "================="
