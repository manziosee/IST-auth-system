import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Linkedin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function LoginForm() {
  const { login, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleLinkedInLogin = () => {
    // Redirect to backend LinkedIn OAuth endpoint
    window.location.href = 'https://ist-auth-system-sparkling-wind-9681.fly.dev/oauth2/login/linkedin';
  };

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

      {state.error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
          <p className="text-red-600 text-sm font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        isLoading={state.isLoading}
      >
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleLinkedInLogin}
        className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-xl py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Linkedin className="h-5 w-5 mr-2" />
        Continue with LinkedIn
      </Button>
    </form>
  );
}