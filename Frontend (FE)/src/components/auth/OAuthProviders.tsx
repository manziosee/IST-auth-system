import { Linkedin, Github, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface OAuthProvidersProps {
  onLinkedInLogin: () => void;
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  isLoading?: boolean;
}

export function OAuthProviders({ 
  onLinkedInLogin, 
  onGoogleLogin, 
  onGithubLogin,
  isLoading = false 
}: OAuthProvidersProps) {
  
  const handleLinkedInLogin = () => {
    try {
      // Redirect to IdP OAuth endpoint
      const clientId = import.meta.env.VITE_CLIENT_ID || 'default-client';
      const redirectUri = `${window.location.origin}/auth/callback/linkedin`;
      const state = Math.random().toString(36).substring(2, 15);
      
      // Store state for verification
      try {
        localStorage.setItem('oauth_state', state);
      } catch (storageError) {
        console.warn('Failed to store OAuth state:', storageError);
        // Continue without state storage in private browsing mode
      }
      
      // In production, this would redirect to the IdP's OAuth endpoint
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const oauthUrl = `${baseUrl.replace('/api', '')}/oauth2/authorization/linkedin?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
      
      onLinkedInLogin();
    } catch (error) {
      console.error('OAuth login failed:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleLinkedInLogin}
          className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={isLoading}
        >
          <Linkedin className="h-5 w-5 mr-2 text-blue-600" />
          Continue with LinkedIn
        </Button>

        {onGoogleLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            className="w-full border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isLoading}
          >
            <Globe className="h-5 w-5 mr-2 text-red-500" />
            Continue with Google
          </Button>
        )}

        {onGithubLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onGithubLogin}
            className="w-full border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isLoading}
          >
            <Github className="h-5 w-5 mr-2 text-gray-800" />
            Continue with GitHub
          </Button>
        )}
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
        <p className="text-xs text-indigo-800 font-medium">
          <strong>OAuth Integration:</strong> In production, these buttons would redirect to the IdP's OAuth endpoints, 
          which handle the OAuth flow with external providers and return JWT tokens.
        </p>
      </div>
    </div>
  );
}
