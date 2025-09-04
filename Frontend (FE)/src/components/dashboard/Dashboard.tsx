import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';
import { AdminDashboard } from './AdminDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { StudentDashboard } from './StudentDashboard';

export function Dashboard() {
  const { state } = useAuth();

  if (!state.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {state.user.role === 'admin' && <AdminDashboard />}
        {state.user.role === 'teacher' && <TeacherDashboard />}
        {state.user.role === 'student' && <StudentDashboard />}
      </main>
    </div>
  );
}