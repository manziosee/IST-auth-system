import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings, 
  User,
  GraduationCap,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';

export function Sidebar() {
  const { state } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/profile', icon: User, label: 'Profile' },
    ];

    const roleSpecificItems = {
      admin: [
        { to: '/students', icon: GraduationCap, label: 'Students' },
        { to: '/teachers', icon: UserCheck, label: 'Teachers' },
        { to: '/courses', icon: BookOpen, label: 'Courses' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ],
      teacher: [
        { to: '/courses', icon: BookOpen, label: 'My Courses' },
        { to: '/students', icon: Users, label: 'Students' },
        { to: '/analytics', icon: BarChart3, label: 'Grade Analytics' },
      ],
      student: [
        { to: '/courses', icon: BookOpen, label: 'My Courses' },
        { to: '/analytics', icon: BarChart3, label: 'My Progress' },
      ],
    };

    return [
      ...baseItems,
      ...roleSpecificItems[state.user?.role || 'student'],
    ];
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {getNavigationItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {state.user?.role === 'admin' && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Admin Tools
            </h3>
            <nav className="space-y-2">
              <NavLink
                to="/integration"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FileText 
                      className={`h-5 w-5 transition-colors ${
                        isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} 
                    />
                    <span className="font-medium">Integration Guide</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}