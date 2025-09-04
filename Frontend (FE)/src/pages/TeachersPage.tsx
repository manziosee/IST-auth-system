import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCheck, Plus, Search, Filter, Mail, Phone, BookOpen, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function TeachersPage() {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const teachers = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@school.edu',
      phone: '+1 (555) 111-2222',
      department: 'Mathematics',
      courses: ['Advanced Mathematics', 'Statistics'],
      students: 52,
      experience: '8 years',
      rating: 4.8,
      status: 'active',
      specialization: 'Applied Mathematics'
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Johnson',
      email: 'john.johnson@school.edu',
      phone: '+1 (555) 222-3333',
      department: 'Physics',
      courses: ['Physics Fundamentals', 'Advanced Physics'],
      students: 38,
      experience: '12 years',
      rating: 4.6,
      status: 'active',
      specialization: 'Quantum Physics'
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.williams@school.edu',
      phone: '+1 (555) 333-4444',
      department: 'Computer Science',
      courses: ['Computer Science Basics', 'Web Development'],
      students: 66,
      experience: '6 years',
      rating: 4.9,
      status: 'active',
      specialization: 'Software Engineering'
    },
    {
      id: 4,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@school.edu',
      phone: '+1 (555) 444-5555',
      department: 'Mathematics',
      courses: ['Statistics & Data Analysis'],
      students: 22,
      experience: '10 years',
      rating: 4.7,
      status: 'active',
      specialization: 'Data Science'
    },
    {
      id: 5,
      firstName: 'Lisa',
      lastName: 'Davis',
      email: 'lisa.davis@school.edu',
      phone: '+1 (555) 555-6666',
      department: 'Chemistry',
      courses: ['Chemistry Laboratory', 'Organic Chemistry'],
      students: 29,
      experience: '15 years',
      rating: 4.5,
      status: 'active',
      specialization: 'Organic Chemistry'
    },
    {
      id: 6,
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@school.edu',
      phone: '+1 (555) 666-7777',
      department: 'Biology',
      courses: ['Biology Fundamentals'],
      students: 18,
      experience: '4 years',
      rating: 4.3,
      status: 'on-leave',
      specialization: 'Molecular Biology'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         teacher.department.toLowerCase() === selectedFilter.toLowerCase() ||
                         teacher.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'on-leave':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">On Leave</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Physics': 'bg-purple-100 text-purple-800',
      'Computer Science': 'bg-green-100 text-green-800',
      'Chemistry': 'bg-orange-100 text-orange-800',
      'Biology': 'bg-pink-100 text-pink-800',
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Only show this page to admins and teachers
  if (state.user?.role === 'student') {
    return (
      <div className="text-center py-12">
        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Students cannot access teacher information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {state.user?.role === 'admin' ? 'Teacher Management' : 'Faculty Directory'}
          </h1>
          <p className="text-gray-600">
            {state.user?.role === 'admin' 
              ? 'Manage faculty members and their assignments'
              : 'View faculty directory and contact information'
            }
          </p>
        </div>
        {state.user?.role === 'admin' && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Teachers</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="computer science">Computer Science</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Dr. {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{teacher.specialization}</p>
                  </div>
                </div>
                {getStatusBadge(teacher.status)}
              </div>

              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(teacher.department)}`}>
                  {teacher.department}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{teacher.students}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{teacher.rating}</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Teaching</p>
                <div className="space-y-1">
                  {teacher.courses.map((course, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <BookOpen className="h-3 w-3" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                {state.user?.role === 'admin' && (
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}