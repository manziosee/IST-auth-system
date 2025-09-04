import React from 'react';
import { BookOpen, Calendar, Clock, Award, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';

export function StudentDashboard() {
  const stats = [
    { title: 'Enrolled Courses', value: '5', change: 'This semester', icon: BookOpen, color: 'blue' },
    { title: 'Assignments Due', value: '3', change: 'This week', icon: FileText, color: 'orange' },
    { title: 'Current GPA', value: '3.7', change: '+0.2 from last semester', icon: Award, color: 'green' },
    { title: 'Completion Rate', value: '92%', change: '+5% this month', icon: TrendingUp, color: 'purple' },
  ];

  const upcomingClasses = [
    { course: 'Advanced Mathematics', time: '9:00 AM', room: 'Room 201', instructor: 'Dr. Smith' },
    { course: 'Physics', time: '1:00 PM', room: 'Lab 101', instructor: 'Prof. Johnson' },
    { course: 'Computer Science', time: '3:30 PM', room: 'Room 405', instructor: 'Dr. Williams' },
  ];

  const assignments = [
    { course: 'Mathematics', title: 'Algebra Problem Set', dueDate: 'Tomorrow', status: 'pending' },
    { course: 'Physics', title: 'Lab Report #3', dueDate: 'Dec 15', status: 'pending' },
    { course: 'Computer Science', title: 'Final Project', dueDate: 'Dec 20', status: 'in-progress' },
    { course: 'Chemistry', title: 'Research Paper', dueDate: 'Dec 10', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic progress and stay organized</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>View Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Classes" className="p-6">
          <div className="space-y-4">
            {upcomingClasses.map((class_item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{class_item.course}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{class_item.time}</span>
                    </span>
                    <span>{class_item.room}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{class_item.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Assignments" className="p-6">
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(assignment.status)}
                    <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{assignment.course}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Grade Progress" className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Advanced Mathematics</span>
              <span className="text-sm font-bold text-green-600">A-</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '88%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Physics</span>
              <span className="text-sm font-bold text-blue-600">B+</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '82%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Computer Science</span>
              <span className="text-sm font-bold text-purple-600">A</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
          </div>
        </Card>

        <Card title="Study Hours This Week" className="p-6 lg:col-span-2">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day}</div>
                <div 
                  className="bg-blue-600 rounded mx-auto transition-all duration-300 hover:bg-blue-700"
                  style={{ 
                    height: `${[4, 6, 5, 7, 8, 3, 2][index] * 8}px`,
                    width: '12px'
                  }}
                />
                <div className="text-xs text-gray-600 mt-1">{[2, 3, 2.5, 3.5, 4, 1.5, 1][index]}h</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total: 17.5 hours</span>
            <span className="text-green-600 font-medium">↑ 12% from last week</span>
          </div>
        </Card>
      </div>
    </div>
  );
}