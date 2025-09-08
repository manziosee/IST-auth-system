import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/auth?error=oauth_failed');
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // Store tokens and redirect to dashboard
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Decode user from token and update auth state
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          // Trigger auth context update by navigating
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to process OAuth tokens:', error);
          navigate('/auth?error=oauth_failed');
        }
      } else {
        navigate('/auth?error=oauth_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Processing OAuth login...</p>
      </div>
    </div>
  );
}