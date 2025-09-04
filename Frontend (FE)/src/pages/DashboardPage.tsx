import { } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';

export function DashboardPage() {
  const { state } = useAuth();

  // For development: show admin dashboard if no user is authenticated
  const userRole = state.user?.role || 'admin';

  return (
    <>
      {userRole === 'admin' && <AdminDashboard />}
      {userRole === 'teacher' && <TeacherDashboard />}
      {userRole === 'student' && <StudentDashboard />}
    </>
  );
}