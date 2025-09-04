import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, School, Calendar, Building2, UserCheck } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';

export function AdminDashboard() {
  const stats = [
    { title: 'Total Students', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Courses', value: '89', change: '+5%', icon: BookOpen, color: 'green' },
    { title: 'Monthly Revenue', value: '$45,678', change: '+8%', icon: DollarSign, color: 'purple' },
    { title: 'Completion Rate', value: '94%', change: '+3%', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivities = [
    { action: 'New student registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { action: 'Course "Advanced Math" published', user: 'Dr. Smith', time: '15 minutes ago', type: 'course' },
    { action: 'Payment received', user: 'Jane Wilson', time: '1 hour ago', type: 'payment' },
    { action: 'New teacher added', user: 'Prof. Johnson', time: '2 hours ago', type: 'user' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, manage your educational institution</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <UserCheck className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activities" className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'user' && <Users className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'course' && <BookOpen className="h-5 w-5 text-green-600" />}
                  {activity.type === 'payment' && <DollarSign className="h-5 w-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group">
              <School className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Manage Schools</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Schedule</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group">
              <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Facilities</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors group">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}