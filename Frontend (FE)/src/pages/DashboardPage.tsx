import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';

export function DashboardPage() {
  const { state } = useAuth();

  if (!state.user) {
    return null;
  }

  return (
    <>
      {state.user.role === 'admin' && <AdminDashboard />}
      {state.user.role === 'teacher' && <TeacherDashboard />}
      {state.user.role === 'student' && <StudentDashboard />}
    </>
  );
}