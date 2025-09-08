import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function RegisterForm() {
  const { register, state } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // Show error message for password mismatch
      alert('Passwords do not match. Please check your password and try again.');
      return;
    }

    try {
      await register(email, password, role, username, firstName, lastName);
    } catch (error) {
      // Error is already handled by the auth context
      console.error('Registration failed:', error);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student', icon: GraduationCap },
    { value: 'teacher', label: 'Teacher', icon: User },
    { value: 'admin', label: 'Administrator', icon: User },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 pr-4 py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200 bg-gradient-to-r from-white to-violet-50"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-3">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200"
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-3">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200"
            placeholder="First Name"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-3">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200"
            placeholder="Last Name"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-3">
          Role
        </label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as 'admin' | 'teacher' | 'student')}
          options={roleOptions}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200 bg-gradient-to-r from-white to-violet-50"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-3">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-12 pr-4 py-4 border-2 border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-400 transition-all duration-200 bg-gradient-to-r from-white to-violet-50"
            placeholder="Confirm your password"
            required
          />
        </div>
        {password !== confirmPassword && confirmPassword && (
          <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 px-3 py-1 rounded-lg">Passwords do not match</p>
        )}
      </div>

      {state.error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
          <p className="text-red-600 text-sm font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        isLoading={state.isLoading}
        disabled={password !== confirmPassword}
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-slate-600 bg-violet-50 px-4 py-2 rounded-xl">
          By signing up, you agree to our <span className="text-violet-600 font-medium">Terms of Service</span> and <span className="text-violet-600 font-medium">Privacy Policy</span>
        </p>
      </div>
    </form>
  );
}