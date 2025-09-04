import React, { useState } from 'react';
import { Code2, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function IntegrationGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htmlWidgetCode = `<!-- EduConnect Authentication Widget -->
<div id="educonnect-auth"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://auth-widget.s3.amazonaws.com/widget.js';
    script.onload = function() {
      EduConnectAuth.init({
        clientId: 'your-app-client-id',
        redirectUri: window.location.origin + '/auth/callback',
        theme: 'light',
        onSuccess: function(tokens) {
          // Handle successful authentication
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          window.location.reload();
        },
        onError: function(error) {
          console.error('Authentication error:', error);
        }
      });
    };
    document.head.appendChild(script);
  })();
</script>`;

  const tokenVerificationCode = `// Token verification in your main app
const verifyToken = async (token) => {
  try {
    // Get public key from IdP's JWKS endpoint
    const response = await fetch('http://your-idp.com/.well-known/jwks.json');
    const jwks = await response.json();
    
    // Verify token signature and claims
    const payload = jwt.verify(token, jwks.keys[0], {
      algorithms: ['RS256'],
      issuer: 'ia-idp',
      audience: 'your-app-client-id'
    });
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Middleware for protecting routes
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};`;

  const refreshTokenCode = `// Automatic token refresh
const apiRequest = async (url, options = {}) => {
  let accessToken = localStorage.getItem('access_token');
  
  const makeRequest = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${token}\`
      }
    });
  };
  
  let response = await makeRequest(accessToken);
  
  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        const refreshResponse = await fetch('http://your-idp.com/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        if (refreshResponse.ok) {
          const tokens = await refreshResponse.json();
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          
          // Retry original request with new token
          response = await makeRequest(tokens.accessToken);
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login';
        }
      } catch (error) {
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }
  
  return response;
};`;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Code2 className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Integration Guide</h2>
      </div>

      <Card title="1. HTML Widget Integration" className="p-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            Add this lightweight widget to any existing application with zero configuration required:
          </p>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{htmlWidgetCode}</code>
            </pre>
            <Button
              onClick={() => copyToClipboard(htmlWidgetCode, 'html')}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
            >
              {copiedSection === 'html' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card title="2. Token Verification (Backend)" className="p-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            Verify JWT tokens in your main application using the IdP's public key:
          </p>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{tokenVerificationCode}</code>
            </pre>
            <Button
              onClick={() => copyToClipboard(tokenVerificationCode, 'verify')}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
            >
              {copiedSection === 'verify' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card title="3. Automatic Token Refresh" className="p-6">
        <div className="space-y-4">
          <p className="text-gray-600">
            Implement automatic token refresh to maintain user sessions:
          </p>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{refreshTokenCode}</code>
            </pre>
            <Button
              onClick={() => copyToClipboard(refreshTokenCode, 'refresh')}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
            >
              {copiedSection === 'refresh' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Security Features" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">✓ Implemented</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• JWT token-based authentication</li>
              <li>• Automatic token refresh</li>
              <li>• Role-based access control</li>
              <li>• Client ID validation</li>
              <li>• Secure token storage</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">🔒 Production Ready</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• RS256 signature verification</li>
              <li>• JWKS endpoint for public keys</li>
              <li>• Email verification flow</li>
              <li>• LinkedIn OAuth integration</li>
              <li>• HTTPS-only token transmission</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Production Deployment</h4>
            <p className="text-blue-800 text-sm mb-3">
              This frontend is ready for S3 hosting. The authentication widget can be deployed as a standalone 
              JavaScript library for easy integration into any existing application.
            </p>
            <div className="flex space-x-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">S3 Compatible</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Zero Dependencies</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">OAuth Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}