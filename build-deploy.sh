#!/bin/bash

# Make sure the script exits on any error
set -e

# Check if the script is run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root. Please use sudo."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Deploy the project
echo "Deploying the project..."
# First, ensure the build directory is there
if [ ! -d "dist" ]; then
  echo "Build directory 'dist' does not exist. Exiting."
  exit 1
fi
# Delete the old deployment directory
rm -rf /var/www/html/williamplays0402.com
# Copy the new build to the deployment directory
cp -r dist /var/www/html/williamplays0402.com

# Set permissions for the deployment directory
echo "Setting permissions for the deployment directory..."
chown -R www-data:www-data /var/www/html/williamplays0402.com
chmod -R 755 /var/www/html/williamplays0402.com

# ask whether the server has been updated
read -p "Has the server been updated? (yes/no): " server_updated
if [[ "$server_updated" != "yes" && "$server_updated" != "no" ]]; then
  echo "Invalid input. Please enter 'yes' or 'no'."
  exit 1
fi
# If the server has not been updated, exit the script
if [ "$server_updated" == "no" ]; then
  echo "Server has not been updated. Exiting."
  exit 0
fi

# edit the ./server/homepage-server.service file to point to the new build directory
echo "Updating service file..."
sed -i "s|\${PATH_TO_SERVER}|$(cd "$(dirname "$0")/server" && pwd)|g" ./server/homepage-server.service

# upload the new service file
cp ./server/homepage-server.service /etc/systemd/system/homepage-server.service

# prompt the user to enter the TURNSTILE_SECRET
read -p "Enter the TURNSTILE_SECRET: " TURNSTILE_SECRET
sed -i "s|\${TURNSTILE_SECRET}|$TURNSTILE_SECRET|g" /etc/systemd/system/homepage-server.service

# prompt the user to enter the DISCORD_WEBHOOK_URL
read -p "Enter the DISCORD_WEBHOOK_URL: " DISCORD_WEBHOOK_URL
sed -i "s|\${DISCORD_WEBHOOK_URL}|$DISCORD_WEBHOOK_URL|g" /etc/systemd/system/homepage-server.service

# navigate to the server directory, install dependencies
cd ./server
npm install

# Reload systemd to recognize the new service file
echo "Reloading systemd..."
systemctl daemon-reload
# add the service or restart it if it already exists
if systemctl is-active --quiet homepage-server; then
  echo "Restarting homepage-server service..."
  systemctl restart homepage-server
else
  echo "Starting homepage-server service..."
  systemctl start homepage-server
fi
# Enable the service to start on boot
echo "Enabling homepage-server service to start on boot..."
systemctl enable homepage-server

# Print success message
echo "Deployment completed successfully!"