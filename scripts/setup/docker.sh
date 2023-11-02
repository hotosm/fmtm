#!/bin/bash

# Tested for Debian 11 Bookworm & Ubuntu 22.04 LTS

IS_DEBIAN=false

pretty_echo() {
    local message="$1"
    local length=${#message}
    local separator=""

    for ((i=0; i<length+4; i++)); do
        separator="$separator-"
    done

    echo ""
    echo "$separator"
    echo "$message"
    echo "$separator"
    echo ""
}

check_os() {
    pretty_echo "Checking Current OS"

    if [ -e /etc/os-release ]; then
        source /etc/os-release
        case "$ID" in
        debian)
            IS_DEBIAN=true
            echo "Current OS is ${PRETTY_NAME}."
            ;;
        ubuntu)
            echo "Current OS is ${PRETTY_NAME}."
            ;;
        *)
            echo "Current OS is not Debian or Ubuntu. Exiting."
            exit 1
            ;;
        esac
    else
        echo "Could not determine the operating system. Exiting."
        exit 1
    fi
}

remove_old_docker_installs() {
    pretty_echo "Removing Old Versions of Docker"
    packages=(
        docker.io
        docker-doc
        docker-compose
        podman-docker
        containerd
        runc
    )
    for pkg in "${packages[@]}"; do
        sudo apt-get remove "$pkg"
    done
}

install_dependencies() {
    pretty_echo "Installing Dependencies"
    sudo apt-get update
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        uidmap \
        dbus-user-session \
        slirp4netns

    if [ "$IS_DEBIAN" = true ]; then
        sudo apt-get install -y fuse-overlayfs
    fi
}

add_gpg_key() {
    pretty_echo "Adding docker gpg key"
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/${id}/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "Done"
}

add_to_apt() {
    pretty_echo "Adding docker to apt source"
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} \
        $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    echo "Done"
}

apt_install_docker() {
    pretty_echo "Installing Docker"
    sudo apt-get update
    sudo apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
}

update_to_rootless() {
    pretty_echo "Disabling docker service if running"
    sudo systemctl disable --now docker.service docker.socket

    pretty_echo "Install rootless docker"
    dockerd-rootless-setuptool.sh install
}

update_docker_ps_format() {
    pretty_echo "Updating docker ps formatting"
    tee ~/.docker/config.json <<EOF
{
    "psFormat": "table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Names}}"
}
EOF
}

add_vars_to_bashrc() {
    pretty_echo "Adding rootless DOCKER_HOST to bashrc"
    user_id=$(id -u)
    export DOCKER_HOST="unix:///run/user/$user_id//docker.sock"
    echo "export DOCKER_HOST=unix:///run/user/$user_id//docker.sock" >> ~/.bashrc
    echo "Done"

    pretty_echo "Adding dc='docker compose' alias"
    echo "alias dc='docker compose'" >> ~/.bashrc
    echo "Done"
}

install_docker() {
    check_os
    remove_old_docker_installs
    install_dependencies
    add_gpg_key
    add_to_apt
    apt_install_docker
    update_to_rootless
    update_docker_ps_format
    add_vars_to_bashrc
}

install_docker
