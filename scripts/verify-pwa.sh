#!/bin/bash

# Verify PWA Assets script

# Rebuild and restart containers
echo "Rebuilding containers..."
docker compose down -v && docker compose up --build -d

# Wait for containers to be ready
echo "Waiting for containers to start..."
sleep 5

# Check if web container is running
WEB_CONTAINER=$(docker ps --filter "name=web" -q)
if [ -z "$WEB_CONTAINER" ]; then
  echo "ERROR: Web container is not running!"
  exit 1
fi

# Check if icons directory exists in Nginx container
echo -e "\n--- Checking if icons directory exists in Nginx container ---"
docker exec $WEB_CONTAINER ls -la /usr/share/nginx/html/icons || { 
  echo "ERROR: Icons directory not found in Nginx container!"; 
  exit 1; 
}

# Check if service worker exists
echo -e "\n--- Checking if service worker exists ---"
docker exec $WEB_CONTAINER ls -la /usr/share/nginx/html/sw.js || { 
  echo "ERROR: Service worker not found!"; 
  exit 1; 
}

# Check if manifest exists
echo -e "\n--- Checking if manifest exists ---"
docker exec $WEB_CONTAINER ls -la /usr/share/nginx/html/manifest.json || { 
  echo "WARNING: manifest.json not found, checking for manifest.webmanifest..."; 
  docker exec $WEB_CONTAINER ls -la /usr/share/nginx/html/manifest.webmanifest || {
    echo "ERROR: No manifest file found!";
    exit 1;
  }
}

# Success message
echo -e "\n✅ PWA assets verification completed successfully!"
echo -e "\nNext steps to verify in browser:"
echo "1. Open http://localhost:8080 in Chrome"
echo "2. Open DevTools (F12) → Network tab"
echo "3. Verify requests for /icons/*.png return 200 status codes"
echo "4. Run Lighthouse in DevTools to check PWA requirements"

# Keep containers running unless asked to stop
echo -e "\nContainers are still running. Use 'docker compose down' to stop them when done testing." 