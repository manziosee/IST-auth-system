#!/bin/sh
# Docker entrypoint script for IST Authentication System Frontend
# Developer: Manzi Niyongira Osee
# Year: 2025

set -euo pipefail

# Function to replace environment variables in built files
replace_env_vars() {
    echo "Replacing environment variables in built files..."
    
    # Validate directory exists
    if [ ! -d "/usr/share/nginx/html" ]; then
        echo "Error: Build directory not found" >&2
        return 1
    fi
    
    # Replace API base URL
    if [ -n "${VITE_API_BASE_URL:-}" ]; then
        find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:8080/api|$VITE_API_BASE_URL|g" {} \; || {
            echo "Error: Failed to replace API base URL" >&2
            return 1
        }
    fi
    
    # Replace OAuth LinkedIn Client ID
    if [ -n "${VITE_OAUTH_LINKEDIN_CLIENT_ID:-}" ]; then
        find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|your_linkedin_client_id|$VITE_OAUTH_LINKEDIN_CLIENT_ID|g" {} \; || {
            echo "Error: Failed to replace LinkedIn client ID" >&2
            return 1
        }
    fi
    
    # Replace OAuth redirect URI
    if [ -n "${VITE_OAUTH_REDIRECT_URI:-}" ]; then
        find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:5173/auth/callback|$VITE_OAUTH_REDIRECT_URI|g" {} \; || {
            echo "Error: Failed to replace OAuth redirect URI" >&2
            return 1
        }
    fi
    
    # Replace JWT public key URL
    if [ -n "${VITE_JWT_PUBLIC_KEY_URL:-}" ]; then
        find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:8080/.well-known/jwks.json|$VITE_JWT_PUBLIC_KEY_URL|g" {} \; || {
            echo "Error: Failed to replace JWT public key URL" >&2
            return 1
        }
    fi
}

# Create runtime configuration file
create_runtime_config() {
    echo "Creating runtime configuration..."
    
    # Ensure directory exists and is writable
    if [ ! -w "/usr/share/nginx/html" ]; then
        echo "Error: Cannot write to nginx html directory" >&2
        return 1
    fi
    
    cat > /usr/share/nginx/html/config.js << EOF || {
        echo "Error: Failed to create runtime configuration" >&2
        return 1
    }
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
if [ "${NODE_ENV:-}" = "production" ]; then
    replace_env_vars || {
        echo "Error: Failed to replace environment variables" >&2
        exit 1
    }
fi

# Create runtime configuration
create_runtime_config || {
    echo "Error: Failed to create runtime configuration" >&2
    exit 1
}

echo "Configuration complete. Starting nginx..."

# Execute the main command
exec "$@"
