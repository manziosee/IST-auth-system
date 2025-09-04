#!/bin/sh
# Docker entrypoint script for IST Authentication System Frontend
# Developer: Manzi Niyongira Osee
# Year: 2025

set -e

# Function to replace environment variables in built files
replace_env_vars() {
    echo "Replacing environment variables in built files..."
    
    # Replace API base URL
    if [ ! -z "$VITE_API_BASE_URL" ]; then
        find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:8080/api|$VITE_API_BASE_URL|g" {} \;
    fi
    
    # Replace OAuth LinkedIn Client ID
    if [ ! -z "$VITE_OAUTH_LINKEDIN_CLIENT_ID" ]; then
        find /usr/share/nginx/html -name "*.js" -exec sed -i "s|your_linkedin_client_id|$VITE_OAUTH_LINKEDIN_CLIENT_ID|g" {} \;
    fi
    
    # Replace OAuth redirect URI
    if [ ! -z "$VITE_OAUTH_REDIRECT_URI" ]; then
        find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:5173/auth/callback|$VITE_OAUTH_REDIRECT_URI|g" {} \;
    fi
    
    # Replace JWT public key URL
    if [ ! -z "$VITE_JWT_PUBLIC_KEY_URL" ]; then
        find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:8080/.well-known/jwks.json|$VITE_JWT_PUBLIC_KEY_URL|g" {} \;
    fi
}

# Create runtime configuration file
create_runtime_config() {
    echo "Creating runtime configuration..."
    
    cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
    API_BASE_URL: '${VITE_API_BASE_URL:-http://localhost:8080/api}',
    OAUTH_LINKEDIN_CLIENT_ID: '${VITE_OAUTH_LINKEDIN_CLIENT_ID:-your_linkedin_client_id}',
    OAUTH_REDIRECT_URI: '${VITE_OAUTH_REDIRECT_URI:-http://localhost:5173/auth/callback}',
    JWT_PUBLIC_KEY_URL: '${VITE_JWT_PUBLIC_KEY_URL:-http://localhost:8080/.well-known/jwks.json}'
};
EOF
}

# Main execution
echo "Starting IST Authentication System Frontend..."
echo "Developer: Manzi Niyongira Osee (2025)"

# Replace environment variables if in production
if [ "$NODE_ENV" = "production" ]; then
    replace_env_vars
fi

# Create runtime configuration
create_runtime_config

echo "Configuration complete. Starting nginx..."

# Execute the main command
exec "$@"
