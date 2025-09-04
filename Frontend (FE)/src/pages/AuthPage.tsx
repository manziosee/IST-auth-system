import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthWidget } from '../components/auth/AuthWidget';

export function AuthPage() {
  const { state } = useAuth();

  if (state.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthWidget />;
}