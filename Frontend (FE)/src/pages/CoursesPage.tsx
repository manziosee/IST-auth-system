import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Plus, Search, Filter, Users, Clock, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function CoursesPage() {
  const { state } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      instructor: 'Dr. Sarah Smith',
      students: 28,
      duration: '16 weeks',
      rating: 4.8,
      description: 'Advanced calculus and linear algebra concepts',
      status: 'active',
      category: 'mathematics'
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      instructor: 'Prof. John Johnson',
      students: 24,
      duration: '12 weeks',
      rating: 4.6,
      description: 'Classical mechanics and thermodynamics',
      status: 'active',
      category: 'science'
    },
    {
      id: 3,
      title: 'Computer Science Basics',
      instructor: 'Dr. Emily Williams',
      students: 31,
      duration: '14 weeks',
      rating: 4.9,
      description: 'Programming fundamentals and algorithms',
      status: 'active',
      category: 'technology'
    },
    {
      id: 4,
      title: 'Statistics & Data Analysis',
      instructor: 'Dr. Michael Brown',
      students: 22,
      duration: '10 weeks',
      rating: 4.7,
      description: 'Statistical methods and data interpretation',
      status: 'draft',
      category: 'mathematics'
    },
    {
      id: 5,
      title: 'Chemistry Laboratory',
      instructor: 'Prof. Lisa Davis',
      students: 18,
      duration: '16 weeks',
      rating: 4.5,
      description: 'Hands-on chemical experiments and analysis',
      status: 'active',
      category: 'science'
    },
    {
      id: 6,
      title: 'Web Development',
      instructor: 'Dr. David Wilson',
      students: 35,
      duration: '12 weeks',
      rating: 4.8,
      description: 'Modern web technologies and frameworks',
      status: 'active',
      category: 'technology'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || course.category === selectedFilter;
    
    // Role-based filtering
    if (state.user?.role === 'teacher') {
      return matchesSearch && matchesFilter && ['Advanced Mathematics', 'Statistics & Data Analysis', 'Physics Fundamentals'].includes(course.title);
    }
    if (state.user?.role === 'student') {
      return matchesSearch && matchesFilter && course.status === 'active';
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'draft':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Draft</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {state.user?.role === 'student' ? 'My Courses' : 'Course Management'}
          </h1>
          <p className="text-gray-600">
            {state.user?.role === 'admin' && 'Manage all courses and curriculum'}
            {state.user?.role === 'teacher' && 'Manage your assigned courses'}
            {state.user?.role === 'student' && 'View your enrolled courses and progress'}
          </p>
        </div>
        {(state.user?.role === 'admin' || state.user?.role === 'teacher') && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            {state.user?.role === 'admin' ? 'Add Course' : 'Create Course'}
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search courses or instructors..."
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
            <option value="all">All Categories</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
                </div>
                {getStatusBadge(course.status)}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                </div>
                <Button variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                  {state.user?.role === 'student' ? 'View Course' : 'Manage'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}