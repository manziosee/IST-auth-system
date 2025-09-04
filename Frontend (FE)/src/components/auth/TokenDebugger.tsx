import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Code, RefreshCw, Key, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TokenDebugger() {
  const { state, refreshToken } = useAuth();
  const [showTokens, setShowTokens] = useState(false);
  const [decodedToken, setDecodedToken] = useState<any>(null);

  const handleDecodeToken = () => {
    if (state.accessToken) {
      try {
        const decoded = authService.decodeToken(state.accessToken);
        setDecodedToken(decoded);
      } catch (error) {
        setDecodedToken({ error: 'Invalid token format' });
      }
    }
  };

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      alert('Token refreshed successfully!');
    } catch (error) {
      alert('Failed to refresh token');
    }
  };

  if (state.user?.role !== 'admin') {
    return null;
  }

  return (
    <Card title="JWT Token Debugger (Admin Only)" className="p-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowTokens(!showTokens)}
            variant="outline"
            size="sm"
          >
            {showTokens ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showTokens ? 'Hide Tokens' : 'Show Tokens'}
          </Button>
          <Button
            onClick={handleDecodeToken}
            variant="outline"
            size="sm"
          >
            <Code className="h-4 w-4 mr-2" />
            Decode Access Token
          </Button>
          <Button
            onClick={handleRefreshToken}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Token
          </Button>
        </div>

        {showTokens && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Key className="h-4 w-4 mr-1" />
                Access Token
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-xs text-gray-600 break-all">
                  {state.accessToken || 'No token available'}
                </code>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Key className="h-4 w-4 mr-1" />
                Refresh Token
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-xs text-gray-600 break-all">
                  {state.refreshToken || 'No token available'}
                </code>
              </div>
            </div>
          </div>
        )}

        {decodedToken && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Decoded Token Payload</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Integration Notes:</strong> This demonstrates JWT token handling for the IdP system. 
            In production, tokens would be signed with RS256 using the IdP's private key, and main apps 
            would verify signatures using the public key from the JWKS endpoint.
          </p>
        </div>
      </div>
    </Card>
  );
}