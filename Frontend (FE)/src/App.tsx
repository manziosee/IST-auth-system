import { } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IntegrationPage } from './pages/IntegrationPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Direct access routes for development - wrapped in Layout */}
            <Route path="/dashboard" element={
              <Layout>
                <DashboardPage />
              </Layout>
            } />
            <Route path="/courses" element={
              <Layout>
                <CoursesPage />
              </Layout>
            } />
            <Route path="/students" element={
              <Layout>
                <StudentsPage />
              </Layout>
            } />
            <Route path="/teachers" element={
              <Layout>
                <TeachersPage />
              </Layout>
            } />
            <Route path="/analytics" element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <SettingsPage />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <ProfilePage />
              </Layout>
            } />
            <Route path="/integration" element={
              <Layout>
                <IntegrationPage />
              </Layout>
            } />
            
            {/* Protected root route */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;