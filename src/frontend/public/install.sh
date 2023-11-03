#!/bin/bash

# Tested for Debian 11 Bookworm & Ubuntu 22.04 LTS

# Global Vars
RUN_AS_ROOT=false
DOTENV_PATH=.env
OS_NAME="debian"
IS_DEBUG=false
BRANCH_NAME=development
COMPOSE_FILE=docker-compose.yml

heading_echo() {
    local message="$1"
    local color="${2:-blue}"
    local separator="--------------------------------------------------------"
    local sep_length=${#separator}
    local pad_length=$(( (sep_length - ${#message}) / 2 ))
    local pad=""
    
    case "$color" in
        "black") color_code="\e[0;30m" ;;
        "red") color_code="\e[0;31m" ;;
        "green") color_code="\e[0;32m" ;;
        "yellow") color_code="\e[0;33m" ;;
        "blue") color_code="\e[0;34m" ;;
        "purple") color_code="\e[0;35m" ;;
        "cyan") color_code="\e[0;36m" ;;
        "white") color_code="\e[0;37m" ;;
        *) color_code="\e[0m" ;;  # Default: reset color
    esac

    for ((i=0; i<pad_length; i++)); do
        pad="$pad "
    done

    echo ""
    echo -e "${color_code}$separator\e[0m"
    echo -e "${color_code}$pad$message$pad\e[0m"
    echo -e "${color_code}$separator\e[0m"
    echo ""
}

yellow_echo() {
    local text="$1"
    echo -e "\e[0;33m${text}\e[0m"
}

display_logo() {
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
}

cleanup_and_exit() {
    echo
    echo "CTRL+C received, exiting..."
    # Add extra cleanup actions here
    exit 1
}

check_user_not_root() {
    if [ "$(id -u)" -eq 0 ]; then
        RUN_AS_ROOT=true

        heading_echo "WARNING" "yellow"

        yellow_echo "Current user is root."
        yellow_echo "This script must run as a non-privileged user account."
        yellow_echo

        if id "svcfmtm" &>/dev/null; then
            yellow_echo "User 'svcfmtm' found."
        else
            yellow_echo "Creating user 'svcfmtm'."
            useradd -m -s /bin/bash svcfmtm 2>/dev/null
        fi

        yellow_echo "Temporarily adding to sudoers list."
        echo "svcfmtm ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/fmtm-sudoers >/dev/null

        echo
        yellow_echo "Rerunning this script as user 'svcfmtm'."
        echo

        if ! command -v machinectl &> /dev/null; then
            yellow_echo "Downloading machinectl requirement."
            sudo apt-get update
            sudo apt-get install -y systemd-container --no-install-recommends
        fi

        # Check if input is direct bash script call (i.e. ends in .sh)
        ext="$(basename "$0")"
        if [ "${ext: -3}" == ".sh" ]; then
            # User called script directly
            root_script_path="$(readlink -f "$0")"
            user_script_path="/home/svcfmtm/$(basename "$0")"
            cp "$root_script_path" "$user_script_path"
            chmod +x "$user_script_path"
            machinectl --quiet shell svcfmtm@ /bin/bash -c "$user_script_path $*"
        else
            # User called script remotely
            machinectl --quiet shell svcfmtm@ /bin/bash -c "$0 $*"
        fi

        exit 0
    fi
}

check_os() {
    heading_echo "Checking Current OS"

    if [ -e /etc/os-release ]; then
        source /etc/os-release
        case "$ID" in
        debian)
            export OS_NAME=${ID}
            echo "Current OS is ${PRETTY_NAME}."
            ;;
        ubuntu)
            export OS_NAME=${ID}
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
    heading_echo "Removing Old Versions of Docker"
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
    heading_echo "Installing Dependencies"
    sudo apt-get update
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        uidmap \
        dbus-user-session \
        slirp4netns

    if [ "$OS_NAME" = "debian" ]; then
        sudo apt-get install -y fuse-overlayfs
    fi
}

add_gpg_key() {
    heading_echo "Adding Docker GPG Key"
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/${ID}/gpg | sudo gpg --yes --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "Done"
}

add_to_apt() {
    heading_echo "Adding Docker to Apt Source"
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} \
        $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    echo "Done"
}

apt_install_docker() {
    heading_echo "Installing Docker"
    sudo apt-get update
    sudo apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin \
        docker-ce-rootless-extras
}

update_to_rootless() {
    heading_echo "Disabling Docker Service (If Running)"
    sudo systemctl disable --now docker.service docker.socket

    heading_echo "Install Rootless Docker"
    dockerd-rootless-setuptool.sh install
}

update_docker_ps_format() {
    heading_echo "Updating docker ps Formatting"

    # Root user
    if [ "$RUN_AS_ROOT" = true ]; then
        sudo tee /root/.docker/config.json <<EOF
        {
            "psFormat": "table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Names}}"
        }
EOF
    fi

    # svcfmtm user
    tee ~/.docker/config.json <<EOF
    {
        "psFormat": "table {{.ID}}\\t{{.Image}}\\t{{.Status}}\\t{{.Names}}"
    }
EOF
}


add_vars_to_bashrc() {
    heading_echo "Adding DOCKER_HOST and 'dc' alias to bashrc"

    user_id=$(id -u)
    docker_host_var="export DOCKER_HOST=unix:///run/user/$user_id//docker.sock"
    dc_alias_cmd="alias dc='docker compose'"

    if [ "$RUN_AS_ROOT" = true ]; then
        # Check if DOCKER_HOST is already defined in /root/.bashrc
        if ! sudo grep -q "$docker_host_var" /root/.bashrc; then
            echo "Adding DOCKER_HOST var to /root/.bashrc."
            echo "$docker_host_var" | sudo tee -a /root/.bashrc > /dev/null
        fi

        # Check if the 'dc' alias already exists in /root/.bashrc
        if ! sudo grep -q "$dc_alias_cmd" /root/.bashrc; then
            echo "Adding 'dc' alias to /root/.bashrc."
            echo "$dc_alias_cmd" | sudo tee -a /root/.bashrc > /dev/null
        fi
    fi

    # Check if DOCKER_HOST is already defined in ~/.bashrc
    if ! grep -q "$docker_host_var" ~/.bashrc; then
        echo "Adding DOCKER_HOST var to ~/.bashrc."
        echo "$docker_host_var" >> ~/.bashrc
    fi

    # Check if the 'dc' alias already exists in ~/.bashrc
    if ! grep -q "$dc_alias_cmd" ~/.bashrc; then
        echo "Adding 'dc' alias to ~/.bashrc."
        echo "$dc_alias_cmd" >> ~/.bashrc
    fi

    echo "Done"
}

install_docker() {
    heading_echo "Docker Install"

    echo "Do you want to install Docker? (y/n)"
    echo
    read -rp "Enter 'y' to install, anything else to continue: " install_docker

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
        echo
        echo "Do you want to overwrite file '"${DOTENV_PATH}"'? y/n"
        echo
        while true
        do
            read -e -p "Enter 'y' to overwrite, anything else to continue: " overwrite

            if [[ "$overwrite" = "y" || "$overwrite" = "yes" ]]
            then
                return 1
            else 
                echo "Continuing with existing .env file."
                return 0
            fi
        done
    fi

    return 1
}

check_if_debug() {
    heading_echo "Local Deployment?"

    echo "Is this a local test deployment?"
    echo
    while true
    do
        read -e -p "Enter 'y' if yes, anything else to continue: " debug

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
    heading_echo "Deployment Environment"

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

        export GIT_BRANCH="${BRANCH_NAME}"
        COMPOSE_FILE="docker-compose.${BRANCH_NAME}.yml"
        break
    done
}

set_external_odk() {
    heading_echo "External ODK Central Host"

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
    heading_echo "ODK User Credentials"

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
    heading_echo "External Database"

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
    heading_echo "S3 Credentials"

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
    heading_echo "FMTM Domain Name"

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

    heading_echo "Certificates"
    echo "FMTM will automatically generate SSL (HTTPS) certificates for your domain name."
    echo
    while true
    do
        echo "Enter an email address you wish to use for certificate generation."
        echo "This will be used by LetsEncrypt, but for no other purpose."
        echo
        read -e -p "Email: " cert_email

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
    heading_echo "OSM OAuth2 Credentials"

    echo "Please enter your OSM authentication details"
    echo
    read -e -p "Client ID: " OSM_CLIENT_ID
    echo
    read -e -p "Client Secret: " OSM_CLIENT_SECRET
    echo
    echo "Login redirect URI (default http://127.0.0.1:7051/osmauth/): "
    while true
    do
        read -e -p "Enter a URI, or nothing for default: " auth_redirect_uri
        
        if [ "$auth_redirect_uri" == "" ]
        then
            echo "Using http://127.0.0.1:7051/osmauth/"
            echo "WARNING: this is a development-only default."
            break
        else 
            echo "Using $auth_redirect_uri"
            OSM_LOGIN_REDIRECT_URI="$auth_redirect_uri"
            break
        fi
    done

    export OSM_CLIENT_ID=${OSM_CLIENT_ID}
    export OSM_CLIENT_SECRET=${OSM_CLIENT_SECRET}
    secret_key=$(tr -dc 'a-zA-Z0-9' </dev/urandom | head -c 50)
    export OSM_SECRET_KEY=${secret_key}
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
    heading_echo "Generating Dotenv File"

    if [ -f ./.env.example ]; then
        echo ".env.example already exists. Continuing."

        echo "substituting variables from .env.example --> ${DOTENV_PATH}"
        ./envsubst < .env.example > ${DOTENV_PATH}
    else
        echo "Downloading .env.example from repo."
        echo
        curl -LO "https://raw.githubusercontent.com/hotosm/fmtm/${BRANCH_NAME:-development}/.env.example"

        echo "substituting variables from .env.example --> ${DOTENV_PATH}"
        ./envsubst < .env.example > ${DOTENV_PATH}

        echo "Deleting .env.example"
        rm .env.example
    fi
}

prompt_user_gen_dotenv() {
    heading_echo "Generate dotenv config for FMTM"

    # Exit if user does not overwrite existing dotenv
    if check_existing_dotenv; then
        return
    fi

    install_envsubst_if_missing

    if [ $IS_DEBUG != true ]; then
        if [ "$BRANCH_NAME" == "main" ]; then
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

    heading_echo "Completed dotenv file generation"
}

get_repo() {
    if ! command -v git &> /dev/null; then
        heading_echo "Downloading GIT."
        sudo apt-get update
        sudo apt-get install -y git --no-install-recommends
    fi

    # Check if not already in 'fmtm' dir
    if [ "$(basename "$PWD")" != "fmtm" ]; then
        heading_echo "Configure FMTM Repo"

        echo "Current dir: $PWD"

        # Check if the 'fmtm' directory already exists
        if [ -d "fmtm" ]; then
            echo "The 'fmtm' directory already exists. Skipping clone."
        else
            echo "Cloning repo https://github.com/hotosm/fmtm.git"
            git clone https://github.com/hotosm/fmtm.git
        fi
    fi
}

run_compose_stack() {
    if [ $IS_DEBUG != true ]; then
        heading_echo "Pulling Required Images"
        docker compose -f ${COMPOSE_FILE} pull
        heading_echo "Building Frontend Image"
        docker compose -f ${COMPOSE_FILE} build ui
    else
        heading_echo "Building All Images"
        docker compose -f ${COMPOSE_FILE} build
    fi

    heading_echo "Starting FMTM"
    docker compose -f ${COMPOSE_FILE} up \
        --detach --remove-orphans --force-recreate
}

final_output() {
    # Source env vars
    . .env

    proto="http"
    if [ "$IS_DEBUG" != true ]; then
        proto="https"
    fi

    suffix=""
    if [ -n "$FMTM_PORT" ]; then
        suffix=":${FMTM_PORT}"
    fi

    heading_echo "FMTM Setup Complete"
    echo
    echo "To access services, go to:"
    echo
    echo "Frontend:     ${proto}://${FMTM_DOMAIN}${suffix}"
    echo "API:          ${proto}://api.${FMTM_DOMAIN}${suffix}"
    echo "S3 Buckets:   ${proto}://s3.${FMTM_DOMAIN}${suffix}"
    echo "ODK Central:  ${proto}://odk.${FMTM_DOMAIN}${suffix}"
    echo
    echo "To login as svcfmtm and inspect the containers, run:"
    echo
    echo "machinectl shell svcfmtm@"
    echo
}

install_fmtm() {
    check_user_not_root
    display_logo

    trap cleanup_and_exit INT
    install_docker

    get_repo
    # Set the working directory to 'fmtm' if it exists
    if [ -d "fmtm" ]; then
        cd fmtm
    else
        echo "The 'fmtm' repo does not exist. Did it clone successfully?"
        echo "Exiting script."
        exit 1
    fi

    check_if_debug
    if [ $IS_DEBUG != true ]; then
        set_deploy_env
    fi

    prompt_user_gen_dotenv
    run_compose_stack
    final_output

    if [ $RUN_AS_ROOT != true ]; then
        # Remove from sudoers
        sudo rm /etc/sudoers.d/fmtm-sudoers
    fi
}

install_fmtm
