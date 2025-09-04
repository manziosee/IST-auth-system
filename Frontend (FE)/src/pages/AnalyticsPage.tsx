import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, TrendingUp, Users, BookOpen, Award, Calendar, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';

export function AnalyticsPage() {
  const { state } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  const getAnalyticsData = () => {
    if (state.user?.role === 'admin') {
      return {
        title: 'Institution Analytics',
        description: 'Comprehensive overview of academic performance and trends',
        stats: [
          { title: 'Total Enrollment', value: '1,234', change: '+12% vs last semester', icon: Users, color: 'blue' as const },
          { title: 'Course Completion', value: '94%', change: '+3% improvement', icon: BookOpen, color: 'green' as const },
          { title: 'Average GPA', value: '3.6', change: '+0.2 vs last semester', icon: Award, color: 'purple' as const },
          { title: 'Teacher Satisfaction', value: '4.7/5', change: '+0.3 improvement', icon: TrendingUp, color: 'orange' as const },
        ]
      };
    } else if (state.user?.role === 'teacher') {
      return {
        title: 'Teaching Analytics',
        description: 'Track your students\' performance and course effectiveness',
        stats: [
          { title: 'My Students', value: '142', change: '+8 this semester', icon: Users, color: 'blue' as const },
          { title: 'Average Grade', value: '87%', change: '+5% improvement', icon: Award, color: 'green' as const },
          { title: 'Course Rating', value: '4.8/5', change: '+0.2 vs last semester', icon: TrendingUp, color: 'purple' as const },
          { title: 'Completion Rate', value: '96%', change: '+4% improvement', icon: BookOpen, color: 'orange' as const },
        ]
      };
    } else {
      return {
        title: 'My Academic Progress',
        description: 'Track your learning journey and achievements',
        stats: [
          { title: 'Current GPA', value: '3.7', change: '+0.2 this semester', icon: Award, color: 'green' as const },
          { title: 'Courses Completed', value: '12', change: '+3 this semester', icon: BookOpen, color: 'blue' as const },
          { title: 'Study Hours/Week', value: '18', change: '+2 hours', icon: Calendar, color: 'purple' as const },
          { title: 'Assignment Score', value: '92%', change: '+8% improvement', icon: TrendingUp, color: 'orange' as const },
        ]
      };
    }
  };

  const analyticsData = getAnalyticsData();

  const performanceData = [
    { subject: 'Mathematics', score: 88, trend: 'up' },
    { subject: 'Physics', score: 82, trend: 'up' },
    { subject: 'Computer Science', score: 95, trend: 'up' },
    { subject: 'Chemistry', score: 79, trend: 'down' },
    { subject: 'Biology', score: 91, trend: 'up' },
  ];

  const monthlyData = [
    { month: 'Aug', value: 85 },
    { month: 'Sep', value: 87 },
    { month: 'Oct', value: 89 },
    { month: 'Nov', value: 86 },
    { month: 'Dec', value: 92 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{analyticsData.title}</h1>
          <p className="text-gray-600">{analyticsData.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance by Subject" className="p-6">
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{item.score}%</span>
                      <TrendingUp className={`h-4 w-4 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'} ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.score >= 90 ? 'bg-green-500' : 
                        item.score >= 80 ? 'bg-blue-500' : 
                        item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Monthly Trend" className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <span>Performance Score</span>
              <span>0-100%</span>
            </div>
            <div className="flex items-end justify-between h-40 space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
                    style={{ height: `${(data.value / 100) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900">{data.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {state.user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Department Performance" className="p-6">
            <div className="space-y-3">
              {['Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Biology'].map((dept, index) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{dept}</span>
                  <span className="text-sm font-bold text-gray-900">{[92, 88, 95, 85, 90][index]}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Enrollment Trends" className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Enrollments</span>
                <span className="text-lg font-bold text-green-600">+156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Graduations</span>
                <span className="text-lg font-bold text-blue-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transfers</span>
                <span className="text-lg font-bold text-orange-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Withdrawals</span>
                <span className="text-lg font-bold text-red-600">8</span>
              </div>
            </div>
          </Card>

          <Card title="Resource Utilization" className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Classrooms</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Laboratories</span>
                  <span className="text-sm font-medium">73%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '73%'}} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Library</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {state.user?.role === 'student' && (
        <Card title="Study Schedule This Week" className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-3">{day}</div>
                <div className="space-y-2">
                  {[
                    ['Math', 'Physics'],
                    ['CS', 'Chem', 'Bio'],
                    ['Math', 'Physics'],
                    ['CS', 'Study'],
                    ['All Subjects'],
                    ['Review'],
                    ['Rest']
                  ][index].map((subject, subIndex) => (
                    <div
                      key={subIndex}
                      className={`p-2 rounded text-xs font-medium ${
                        subject === 'Rest' ? 'bg-gray-100 text-gray-600' :
                        subject === 'Study' || subject === 'Review' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {subject}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}