import React from 'react';
import { BookOpen, Users, Calendar, FileText, Clock, Award, MessageCircle } from 'lucide-react';
import { StatsCard } from '../ui/StatsCard';
import { Card } from '../ui/Card';

export function TeacherDashboard() {
  const stats = [
    { title: 'My Courses', value: '6', change: '+2 new', icon: BookOpen, color: 'blue' },
    { title: 'Total Students', value: '142', change: '+8 this week', icon: Users, color: 'green' },
    { title: 'Pending Assignments', value: '23', change: 'Due this week', icon: FileText, color: 'orange' },
    { title: 'Average Grade', value: '87%', change: '+2% improvement', icon: Award, color: 'purple' },
  ];

  const upcomingClasses = [
    { course: 'Advanced Mathematics', time: '9:00 AM', room: 'Room 201', students: 28 },
    { course: 'Statistics', time: '11:30 AM', room: 'Room 305', students: 24 },
    { course: 'Calculus II', time: '2:00 PM', room: 'Room 201', students: 31 },
  ];

  const recentSubmissions = [
    { student: 'Alice Johnson', assignment: 'Algebra Problem Set', submitted: '5 min ago', grade: null },
    { student: 'Bob Smith', assignment: 'Statistics Project', submitted: '1 hour ago', grade: 'A-' },
    { student: 'Carol Davis', assignment: 'Calculus Essay', submitted: '2 hours ago', grade: null },
    { student: 'David Wilson', assignment: 'Math Research', submitted: '3 hours ago', grade: 'B+' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Schedule Class</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Schedule" className="p-6">
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
                </div>
                <div className="text-sm text-gray-600">
                  {class_item.students} students
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Submissions" className="p-6">
          <div className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{submission.student}</h3>
                  <p className="text-sm text-gray-600">{submission.assignment}</p>
                  <p className="text-xs text-gray-500 mt-1">{submission.submitted}</p>
                </div>
                <div className="text-right">
                  {submission.grade ? (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {submission.grade}
                    </span>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Grade
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Course Management" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Advanced Mathematics</h3>
                <p className="text-sm text-gray-600">28 students enrolled</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Statistics</h3>
                <p className="text-sm text-gray-600">24 students enrolled</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Calculus II</h3>
                <p className="text-sm text-gray-600">31 students enrolled</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}