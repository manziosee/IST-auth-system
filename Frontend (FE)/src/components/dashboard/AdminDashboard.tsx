import { Users, DollarSign, School, Calendar, Building2, UserCheck, Shield, Database, Settings, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';

export function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '2,847', change: '+15% this month', icon: Users, color: 'blue' as const },
    { title: 'System Health', value: '99.8%', change: 'Uptime', icon: Database, color: 'green' as const },
    { title: 'Monthly Budget', value: '$127,450', change: '+3% allocated', icon: DollarSign, color: 'purple' as const },
    { title: 'Security Alerts', value: '2', change: 'Active issues', icon: Shield, color: 'red' as const },
  ];

  const systemActivities = [
    { action: 'Database backup completed', user: 'System', time: '5 minutes ago', type: 'system' },
    { action: 'Security scan initiated', user: 'Admin Bot', time: '1 hour ago', type: 'security' },
    { action: 'Budget report generated', user: 'Finance Module', time: '2 hours ago', type: 'finance' },
    { action: 'User permissions updated', user: 'IT Admin', time: '3 hours ago', type: 'admin' },
  ];

  const departmentBudgets = [
    { department: 'Mathematics', allocated: '$45,000', spent: '$38,200', percentage: 85 },
    { department: 'Science', allocated: '$52,000', spent: '$41,600', percentage: 80 },
    { department: 'Technology', allocated: '$38,000', spent: '$35,150', percentage: 92 },
    { department: 'Arts', allocated: '$28,000', spent: '$22,400', percentage: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600">Manage institution infrastructure and budgets</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <UserCheck className="h-4 w-4" />
            <span>Add User</span>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            <span>Security</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="System Activities" className="p-6">
          <div className="space-y-4">
            {systemActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'system' && <Database className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'security' && <Shield className="h-5 w-5 text-red-600" />}
                  {activity.type === 'finance' && <DollarSign className="h-5 w-5 text-green-600" />}
                  {activity.type === 'admin' && <Settings className="h-5 w-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Department Budgets" className="p-6">
          <div className="space-y-4">
            {departmentBudgets.map((budget, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{budget.department}</span>
                  <span className="text-sm text-gray-600">{budget.spent} / {budget.allocated}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${budget.percentage > 90 ? 'bg-red-500' : budget.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{width: `${budget.percentage}%`}}
                  />
                </div>
                <div className="text-xs text-gray-500">{budget.percentage}% utilized</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Administrative Tools" className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors group">
            <School className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Institution Settings</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors group">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Academic Calendar</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors group">
            <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Facility Management</span>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors group">
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-900">Security Center</span>
          </button>
        </div>
      </Card>
    </div>
  );
}