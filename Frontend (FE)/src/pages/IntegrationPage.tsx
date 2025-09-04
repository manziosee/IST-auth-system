import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IntegrationGuide } from '../components/integration/IntegrationGuide';
import { Shield } from 'lucide-react';

export function IntegrationPage() {
  const { state } = useAuth();

  if (state.user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only administrators can access integration documentation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integration Guide</h1>
        <p className="text-gray-600">Learn how to integrate the EduConnect Identity Provider into your applications</p>
      </div>
      <IntegrationGuide />
    </div>
  );
}