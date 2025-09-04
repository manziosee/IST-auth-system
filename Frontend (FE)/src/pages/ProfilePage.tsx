import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Calendar, Edit3, Save, X, Shield, Key } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProfilePage() {
  const { state } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data for development when no user is authenticated
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@school.edu',
    role: 'admin' as const,
    emailVerified: true,
    createdAt: new Date().toISOString()
  };
  
  const currentUser = state.user || mockUser;
  
  const [profileData, setProfileData] = useState({
    firstName: currentUser.firstName || 'John',
    lastName: currentUser.lastName || 'Doe',
    email: currentUser.email || 'admin@school.edu',
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, Education City, EC 12345',
    bio: 'Passionate about education and continuous learning. Dedicated to academic excellence and student success.',
    department: currentUser.role === 'teacher' ? 'Mathematics' : '',
    studentId: currentUser.role === 'student' ? 'STU-2024-001' : '',
    employeeId: currentUser.role !== 'student' ? 'EMP-2024-001' : '',
  });

  const handleSave = () => {
    // In a real app, this would update the backend
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      firstName: currentUser.firstName || 'John',
      lastName: currentUser.lastName || 'Doe',
      email: currentUser.email || 'admin@school.edu',
      phone: '+1 (555) 123-4567',
      address: '123 University Ave, Education City, EC 12345',
      bio: 'Passionate about education and continuous learning. Dedicated to academic excellence and student success.',
      department: currentUser.role === 'teacher' ? 'Mathematics' : '',
      studentId: currentUser.role === 'student' ? 'STU-2024-001' : '',
      employeeId: currentUser.role !== 'student' ? 'EMP-2024-001' : '',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(currentUser.role || '')}`}>
              {currentUser.role?.toUpperCase()}
            </span>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(currentUser.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Personal Information" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              {currentUser.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Input
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              )}
              {currentUser.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <Input
                    value={profileData.studentId}
                    disabled
                  />
                </div>
              )}
              {currentUser.role !== 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <Input
                    value={profileData.employeeId}
                    disabled
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </Card>

          <Card title="Account Security" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Email Verified</p>
                    <p className="text-xs text-green-600">Your email address has been verified</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Two-Factor Authentication</p>
                    <p className="text-xs text-blue-600">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Last Login</p>
                    <p className="text-xs text-gray-600">Today at 2:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}