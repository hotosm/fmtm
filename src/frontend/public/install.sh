#!/bin/bash

# Tested for Debian 11 Bookworm & Ubuntu 22.04 LTS

echo 
echo " ███████████ ██████   ██████ ███████████ ██████   ██████"
echo "░░███░░░░░░█░░██████ ██████ ░█░░░███░░░█░░██████ ██████ "
echo " ░███   █ ░  ░███░█████░███ ░   ░███  ░  ░███░█████░███ "
echo " ░███████    ░███░░███ ░███     ░███     ░███░░███ ░███ "
echo " ░███░░░█    ░███ ░░░  ░███     ░███     ░███ ░░░  ░███ "
echo " ░███  ░     ░███      ░███     ░███     ░███      ░███ "
echo " █████       █████     █████    █████    █████     █████"
echo "░░░░░       ░░░░░     ░░░░░    ░░░░░    ░░░░░     ░░░░░ "
echo
echo "--------------------------------------------------------"
echo "             Field Tasking Mapping Manager              "
echo "--------------------------------------------------------"
echo
echo

# Global Vars
DOTENV_PATH=.env
IS_DEBUG=false
IS_DEBIAN=false
BRANCH_NAME=development
COMPOSE_FILE=docker-compose.yml

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
    pretty_echo "Docker Install"

    read -rp "Do you want to install Docker? (y/n): " install_docker

    if [[ "$install_docker" == "y" ||  "$install_docker" == "yes" ]]; then
        check_os
        remove_old_docker_installs
        install_dependencies
        add_gpg_key
        add_to_apt
        apt_install_docker
        update_to_rootless
        update_docker_ps_format
        add_vars_to_bashrc
    fi
}

install_envsubst_if_missing() {
    if ! command -v curl &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y curl --no-install-recommends
    fi

    echo
    # Get a8m/envsubst (required for default vals syntax ${VAR:-default})
    # Use local version, as envsubst may be installed on system already
    if [ -f ./envsubst ]; then
        echo "envsubst already exists. Continuing."
    else
        echo "Downloading a8m/envsubst"
        echo
        curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o envsubst
        chmod +x envsubst
    fi
}

check_existing_dotenv() {
    if [ -f "${DOTENV_PATH}" ]
    then
        echo "WARNING: ${DOTENV_PATH} file already exists."
        echo "This script will overwrite the content of this file."
        until [ "$conf" = "y" -o "$conf" = "n" ]
        do
            read -e -p "Do you want to overwrite it? y/n " conf
            if [ "$conf" = "y" ]
            then
                return 1
            elif [ "$conf" = "n" ]
            then
                echo "Continuing with existing .env file."
                return 0
            else 
                echo "Invalid input!"
            fi
        done
    fi

    return 1
}

check_debug() {
    pretty_echo "Local Deployment?"

    echo "Is this a local test deployment?"
    while true
    do
        read -e -p "Enter y if yes, anything else to continue: " debug

        if [[ "$debug" = "y" || "$debug" = "yes" ]]
        then
            IS_DEBUG=true
            export DEBUG=True
            export LOG_LEVEL="DEBUG"
            echo "Using debug configuration."
        else
            IS_DEBUG=false
            export DEBUG=False
            export LOG_LEVEL="INFO"
            break
        fi
        break
    done
}

set_deploy_env() {
    pretty_echo "Deployment Environment"

    while true
    do
        echo "Which environment do you wish to run? (dev/staging/prod)"
        echo
        echo "Both dev & staging include ODK Central and S3 buckets."
        echo "For prod, it is expected you provide and external instances of:"
        echo
        echo "- ODK Central"
        echo "- S3 Buckets"
        echo
        read -e -p "Enter the environment (dev/staging/prod): " environment

        case "$environment" in
            dev)
                BRANCH_NAME="development"
                ;;
            staging)
                BRANCH_NAME="staging"
                ;;
            prod)
                BRANCH_NAME="main"
                ;;
            *)
                echo "Invalid environment name. Please enter dev, staging, or prod."
                ;;

        esac

        COMPOSE_FILE="docker-compose.${BRANCH_NAME}.yml"
        break
    done
}

set_external_odk() {
    pretty_echo "External ODK Central Host"

    echo "Please enter the ODKCentral URL."
    read -e -p "ODKCentral URL: " ODK_CENTRAL_URL
    echo
    export ODK_CENTRAL_URL=${ODK_CENTRAL_URL}

    set_odk_user_creds
}

set_fmtm_db_pass() {
    db_pass=$(tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 50)
    export FMTM_DB_PASSWORD=${db_pass}
}

set_odk_db_pass() {
    db_pass=$(tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 50)
    export ODK_DB_PASSWORD=${db_pass}
}

set_odk_user_creds() {
    pretty_echo "ODK User Credentials"

    echo "Please enter the ODKCentral Email."
    read -e -p "ODKCentral Email: " ODK_CENTRAL_USER
    echo
    export ODK_CENTRAL_USER=${ODK_CENTRAL_USER}

    echo "Please enter the ODKCentral Password."
    read -e -p "ODKCentral Password: " ODK_CENTRAL_PASSWD
    echo
    export ODK_CENTRAL_PASSWD=${ODK_CENTRAL_PASSWD}
}

check_external_database() {
    pretty_echo "External Database"

    echo "Do you want to use an external database instead of local?"
    while true
    do
        read -e -p "Enter y for external, anything else to continue: " externaldb

        if [ "$externaldb" = "y" ]
        then
            EXTERNAL_DB="True"
            echo "Using external database."
        fi
        break
    done

    if [ "$EXTERNAL_DB" = "True" ]
    then
        echo
        echo "Please enter the database host."
        read -e -p "FMTM DB Host: " FMTM_DB_HOST
        echo
        export FMTM_DB_HOST=${FMTM_DB_HOST}

        echo "Please enter the database name."
        read -e -p "FMTM DB Name: " FMTM_DB_NAME
        echo
        export FMTM_DB_NAME=${FMTM_DB_NAME}

        echo "Please enter the database user."
        read -e -p "FMTM DB User: " FMTM_DB_USER
        echo
        export FMTM_DB_USER=${FMTM_DB_USER}

        echo "Please enter the database password."
        read -e -p "FMTM DB Password: " FMTM_DB_PASSWORD
        echo
        export FMTM_DB_PASSWORD=${FMTM_DB_PASSWORD}

    else
        set_fmtm_db_pass
    fi
}

set_external_s3() {
    pretty_echo "S3 Credentials"

    echo "Please enter the S3 host endpoint."
    read -e -p "S3 Endpoint: " S3_ENDPOINT
    echo
    export S3_ENDPOINT=${S3_ENDPOINT}

    echo "Please enter the access key."
    read -e -p "S3 Access Key: " S3_ACCESS_KEY
    echo
    export S3_ACCESS_KEY=${S3_ACCESS_KEY}

    echo "Please enter the secret key."
    read -e -p "S3 Secret Key: " S3_SECRET_KEY
    echo
    export S3_SECRET_KEY=${S3_SECRET_KEY}

    # TODO update S3_BUCKET_NAME_BASEMAPS & S3_BUCKET_NAME_OVERLAYS
}

set_minio_s3_creds() {
    access_key=$(tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 50)
    export S3_ACCESS_KEY=${access_key}

    secret_key=$(tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 50)
    export S3_SECRET_KEY=${secret_key}
}

set_domains() {
    pretty_echo "FMTM Domain Name"

    echo "To run FMTM you must own a domain name."
    while true
    do
        read -e -p "Enter a valid domain name you wish to run FMTM from: " fmtm_domain

        if [ "$fmtm_domain" = "" ]
        then
            echo "Invalid input!"
        else 
            export FMTM_DOMAIN="${fmtm_domain}"
            break
        fi
    done


    current_ip=$(hostname -I | cut -d' ' -f1)

    echo
    echo "Using $fmtm_domain as your main domain for FMTM."
    echo
    echo "Please ensure the following DNS entries are set:"
    echo
    echo "$fmtm_domain --> $current_ip"
    echo "api.$fmtm_domain --> $current_ip"

    if [ "$BRANCH_NAME" != "main" ]
    then
        echo "s3.$fmtm_domain --> $current_ip"
        echo "odk.$fmtm_domain --> $current_ip"
    fi

    echo
    read -e -p "Once these DNS entries are set and valid, press ENTER to continue." valid

    pretty_echo "Certificates"
    echo "FMTM will automatically generate SSL (HTTPS) certificates for your domain name."
    while true
    do
        echo "Enter an email address you wish to use for certificate generation."
        read -e -p "This will be used by LetsEncrypt, but for no other purpose: " cert_email

        if [ "$cert_email" = "" ]
        then
            echo "Invalid input!"
        else 
            export CERT_EMAIL="${cert_email}"
            break
        fi
    done
}

set_osm_credentials() {
    pretty_echo "OSM OAuth2 Credentials"

    echo "Please enter your OSM authentication details"
    echo
    read -e -p "Client ID: " OSM_CLIENT_ID
    echo
    read -e -p "Client Secret: " OSM_CLIENT_SECRET
    echo
    read -e -p "Secret Key: " OSM_SECRET_KEY
    echo
    echo "Login redirect URI (default http://127.0.0.1:7051/osmauth/): "
    while true
    do
        read -e -p "Enter a URI, or nothing for default: " auth_redirect_uri
        
        if [ "$auth_redirect_uri" == "" ]
        then
            echo "Using $OSM_LOGIN_REDIRECT_URI"
            break
        else 
            echo "Using $auth_redirect_uri"
            OSM_LOGIN_REDIRECT_URI="$auth_redirect_uri"
            break
        fi
    done

    export OSM_CLIENT_ID=${OSM_CLIENT_ID}
    export OSM_CLIENT_SECRET=${OSM_CLIENT_SECRET}
    export OSM_SECRET_KEY=${OSM_SECRET_KEY}
    export OSM_LOGIN_REDIRECT_URI=${OSM_LOGIN_REDIRECT_URI}
}

check_change_port() {
    echo "The default port for local development is 7050."
    while true
    do
        read -e -p "Enter a different port if required, or nothing for default: " fmtm_port
        
        if [ "$fmtm_port" == "" ]
        then
            echo "Using port 7050 for FMTM."
            break
        else 
            echo "Using $fmtm_port"
            export FMTM_PORT="$fmtm_port"
            break
        fi
    done
}

generate_dotenv() {
    pretty_echo "Generating Dotenv File"

    if [ -f ./.env.example ]; then
        echo ".env.example already exists. Continuing."
    else
        echo "Downloading .env.example from repo."
        echo
        curl -LO "https://raw.githubusercontent.com/hotosm/fmtm/${BRANCH_NAME:-development}/.env.example"
    fi

    echo "substituting variables from .env.example --> ${DOTENV_PATH}"
    ./envsubst < .env.example > ${DOTENV_PATH}

    echo "Deleting .env.example"
    rm .env.example
}

prompt_user_for_dotenv() {
    pretty_echo "Generate dotenv config for FMTM"

    if check_existing_dotenv; then
        return # Exit the function
    fi

    install_envsubst_if_missing
    check_debug

    if [ $IS_DEBUG != true ]; then
        set_deploy_env

        if [ "$BRANCH_NAME" == "main" ]
        then
            set_external_odk
            check_external_database
            set_external_s3
        else
            set_fmtm_db_pass
            set_odk_db_pass
            set_odk_user_creds
            set_minio_s3_creds
        fi

        set_domains

    else
        set_odk_user_creds
        check_change_port
    fi

    set_osm_credentials
    generate_dotenv

    pretty_echo "Completed dotenv file generation"
}

get_repo() {
    if ! command -v git &> /dev/null; then
        pretty_echo "Downloading GIT."
        sudo apt-get update
        sudo apt-get install -y git --no-install-recommends
    fi

    if [ "$(basename "$PWD")" != "fmtm" ]; then
        pretty_echo "Cloning Repo"
        git clone https://github.com/hotosm/fmtm.git
        cd fmtm
    fi
}

run_compose_stack() {
    pretty_echo "Building Required Images"
    docker compose -f ${COMPOSE_FILE} build

    pretty_echo "Starting FMTM"
    docker compose -f ${COMPOSE_FILE} up \
        --detach --remove-orphans --force-recreate
}


install_docker
get_repo
prompt_user_for_dotenv
run_compose_stack

pretty_echo "FMTM Setup Complete"
echo
echo "To access services, go to:"
echo
echo "Froontend: http://fmtm.localhost:7050"
