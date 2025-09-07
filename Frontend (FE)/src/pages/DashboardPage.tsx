import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';

export function DashboardPage() {
  const { state } = useAuth();

  // Redirect to login if user is not authenticated
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = state.user.role;

  return (
    <>
      {userRole === 'admin' && <AdminDashboard />}
      {userRole === 'teacher' && <TeacherDashboard />}
      {userRole === 'student' && <StudentDashboard />}
    </>
  );
}