import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthRedirect component handles authentication-based routing
 * Redirects unauthenticated users to login and authenticated users to dashboard
 */
export function AuthRedirect() {
  const { state } = useAuth();

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

// Keep old export for backward compatibility
export const AppRouter = AuthRedirect;