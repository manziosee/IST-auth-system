import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Search, Filter, Mail, Phone, GraduationCap, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function StudentsPage() {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      enrollmentDate: '2024-09-01',
      gpa: 3.8,
      courses: ['Advanced Mathematics', 'Physics', 'Computer Science'],
      status: 'active',
      year: 'Junior'
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@school.edu',
      phone: '+1 (555) 234-5678',
      enrollmentDate: '2024-09-01',
      gpa: 3.6,
      courses: ['Statistics', 'Chemistry', 'Biology'],
      status: 'active',
      year: 'Sophomore'
    },
    {
      id: 3,
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@school.edu',
      phone: '+1 (555) 345-6789',
      enrollmentDate: '2023-09-01',
      gpa: 3.9,
      courses: ['Advanced Mathematics', 'Physics', 'Chemistry'],
      status: 'active',
      year: 'Senior'
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@school.edu',
      phone: '+1 (555) 456-7890',
      enrollmentDate: '2024-01-15',
      gpa: 3.4,
      courses: ['Computer Science', 'Web Development'],
      status: 'active',
      year: 'Freshman'
    },
    {
      id: 5,
      firstName: 'Emma',
      lastName: 'Brown',
      email: 'emma.brown@school.edu',
      phone: '+1 (555) 567-8901',
      enrollmentDate: '2023-09-01',
      gpa: 4.0,
      courses: ['Advanced Mathematics', 'Statistics', 'Physics'],
      status: 'active',
      year: 'Senior'
    },
    {
      id: 6,
      firstName: 'Frank',
      lastName: 'Miller',
      email: 'frank.miller@school.edu',
      phone: '+1 (555) 678-9012',
      enrollmentDate: '2024-09-01',
      gpa: 3.2,
      courses: ['Biology', 'Chemistry'],
      status: 'inactive',
      year: 'Sophomore'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && student.status === 'active') ||
                         (selectedFilter === 'inactive' && student.status === 'inactive') ||
                         student.year.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600 bg-green-50';
    if (gpa >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>
      : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Inactive</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {state.user?.role === 'admin' ? 'Student Management' : 'My Students'}
          </h1>
          <p className="text-gray-600">
            {state.user?.role === 'admin' 
              ? 'Manage student enrollment and academic records'
              : 'View and track your students\' progress'
            }
          </p>
        </div>
        {state.user?.role === 'admin' && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search students..."
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
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{student.year}</p>
                  </div>
                </div>
                {getStatusBadge(student.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">GPA</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGpaColor(student.gpa)}`}>
                  {student.gpa.toFixed(1)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Enrolled Courses</p>
                <div className="flex flex-wrap gap-1">
                  {student.courses.slice(0, 2).map((course, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {course}
                    </span>
                  ))}
                  {student.courses.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{student.courses.length - 2} more
                    </span>
                  )}
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

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}