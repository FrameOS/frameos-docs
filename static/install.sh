#!/bin/bash

# FrameOS Installation Script

# Display the banner
echo "==============================================="
echo "    ______                          ____  _____"
echo "   / ____/________ _____ ___  ___  / __ \/ ___/"
echo "  / /_  / ___/ __ \`/ __ \`__ \/ _ \/ / / /\__ \ "
echo " / __/ / /  / /_/ / / / / / /  __/ /_/ /___/ / "
echo "/_/   /_/   \__,_/_/ /_/ /_/\___/\____//____/  "
echo "==============================================="
echo "Welcome to the FrameOS installation script!"

# Function to check if docker is installed and accessible
check_docker() {
  if ! command -v docker &>/dev/null; then
    echo "Docker is not installed."
    return 1
  fi

  if ! docker info &>/dev/null; then
    echo "Docker is installed but not accessible by the current user."
    return 2
  fi

  return 0
}

# Detect OS
OS_TYPE="$(uname -s)"
case "${OS_TYPE}" in
    Linux*)     OS=Linux;;
    Darwin*)    OS=Mac;;
    *)          OS="UNKNOWN:${OS_TYPE}"
esac

echo "Detected OS: ${OS}"

if [ "$OS" = "Linux" ]; then
  DEFAULT_PROJECT_ROOT="$HOME/.frameos"
elif [ "$OS" = "Mac" ]; then
  DEFAULT_PROJECT_ROOT="$HOME/Library/Application Support/FrameOS"
else
  echo "Unsupported OS. Exiting."
  exit 1
fi

# Check Docker status
check_docker
docker_status=$?

if [ $docker_status -eq 0 ]; then
  echo "Docker is installed and accessible."
elif [ $docker_status -eq 1 ]; then
  echo "Docker is not installed."

  if [ "$OS" = "Linux" ]; then
    echo "Attempting to install Docker..."

    # Check if we have root access
    if [ "$EUID" -ne 0 ]; then
      echo "Root privileges are required to install Docker."
      echo "Please run this script as root or with sudo."
      exit 1
    fi

    # Detect Linux distribution
    if [ -f /etc/os-release ]; then
      . /etc/os-release
      DISTRO=$ID
      VERSION=$VERSION_ID
      echo "Detected Linux Distribution: $PRETTY_NAME"

      if [[ "$DISTRO" == "ubuntu" || "$DISTRO" == "debian" || "$DISTRO" == "raspbian" ]]; then
        apt-get update
        apt-get install -y \
          ca-certificates \
          curl \
          gnupg \
          lsb-release

        mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/$DISTRO/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$DISTRO \
          $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list >/dev/null

        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      else
        echo "Your Linux distribution ($DISTRO) is not supported by this script."
        echo "Please install Docker manually and re-run this script."
        exit 1
      fi
    else
      echo "Cannot detect your Linux distribution."
      echo "Please install Docker manually and re-run this script."
      exit 1
    fi

    # Start Docker service
    echo "Starting Docker service..."
    systemctl start docker

    # Re-run Docker accessibility check
    check_docker
    docker_status=$?

    if [ $docker_status -eq 0 ]; then
      echo "Docker is now installed and accessible."
    elif [ $docker_status -eq 2 ]; then
      echo "Docker is installed but not accessible by the current user."

      # Add the current user to the docker group
      echo "Adding user $USER to the docker group."

      usermod -aG docker "$USER"

      echo "You may need to log out and log back in for group changes to take effect."
      echo "Please re-run the script after logging back in."
      exit 1
    else
      echo "Failed to install Docker."
      exit 1
    fi

  elif [ "$OS" = "Mac" ]; then
    echo "Please install Docker Desktop or OrbStack manually."
    echo "You can install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    echo "Or install OrbStack via Homebrew:"
    echo "  brew install --cask orbstack"
    echo "After installing, re-run this script."
    exit 1
  else
    echo "Unsupported OS. Please install Docker manually and re-run this script."
    exit 1
  fi

elif [ $docker_status -eq 2 ]; then
  echo "Docker is installed but not accessible by the current user."

  # Check if we have root access to add user to docker group (Linux only)
  if [ "$OS" = "Linux" ]; then
    if [ "$EUID" -ne 0 ]; then
      echo "Root privileges are required to add the user to the docker group."
      echo "Please run this script as root or with sudo."
      exit 1
    fi

    echo "Adding user $USER to the docker group."
    usermod -aG docker "$USER"
    echo "You may need to log out and log back in for group changes to take effect."
    echo "Please re-run the script after logging back in."
    exit 1
  else
    echo "Please ensure Docker is accessible by your user and re-run the script."
    exit 1
  fi
fi

# Ask for the project root directory
read -p "Enter the project root directory [${DEFAULT_PROJECT_ROOT}]: " PROJECT_ROOT
PROJECT_ROOT=${PROJECT_ROOT:-${DEFAULT_PROJECT_ROOT}}
echo "Using project root directory: $PROJECT_ROOT"

# Create db directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/db"

# Ask for the port number
read -p "Enter the port you want the FrameOS backend to run on [8989]: " PORT
PORT=${PORT:-8989}
echo "FrameOS backend will run on port: $PORT"

ENV_FILE="$PROJECT_ROOT/.env"

# Load existing .env file if it exists
if [ -f "$ENV_FILE" ]; then
  echo "Loading existing environment variables from .env file."
  source "$ENV_FILE"
fi

# Generate SECRET_KEY if not already set
if [ -z "$SECRET_KEY" ]; then
  echo "Generating SECRET_KEY..."
  SECRET_KEY=$(openssl rand -base64 32)
fi

# Save environment variables to .env file
echo "SECRET_KEY=\"$SECRET_KEY\"" > "$ENV_FILE"
echo "PORT=$PORT" >> "$ENV_FILE"

# Check if the FrameOS container is already running
if [ "$(docker ps -q -f name=frameos)" ]; then
  echo "FrameOS container is already running. Restarting container..."
  docker stop frameos
  docker rm frameos
fi

echo "Pulling and running the FrameOS backend container..."
docker run -d -p "$PORT:8989" -v "$PROJECT_ROOT/db:/app/db" --name frameos --restart always --env-file "$ENV_FILE" frameos/frameos

# Ask the user if they want automatic updates
read -p "Do you want to enable automatic updates for FrameOS? (Y/n): " enable_updates
enable_updates=${enable_updates:-Y}

if [[ "$enable_updates" =~ ^[Yy]$ ]]; then
  echo "Setting up automatic updates using Watchtower..."
  # Check if Watchtower is already running
  if [ "$(docker ps -q -f name=watchtower)" ]; then
    echo "Watchtower is already running."
  else
    # Run Watchtower container
    docker run -d \
      --name watchtower \
      -v /var/run/docker.sock:/var/run/docker.sock \
      containrrr/watchtower \
      --interval 86400 \
      frameos
  fi
fi

echo "Installation complete!"
echo "You can access the FrameOS backend at http://localhost:$PORT"
