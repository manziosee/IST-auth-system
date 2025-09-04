import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { GraduationCap } from 'lucide-react';

export function AuthWidget() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (state.user) {
      navigate('/dashboard');
    }
  }, [state.user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-fuchsia-600/90"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4 shadow-lg backdrop-blur-sm">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">EduConnect Portal</h1>
            <p className="text-purple-100 font-medium">Secure Identity Provider</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-1.5 mb-8 border border-violet-200">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-violet-600 hover:text-violet-800 hover:bg-white/50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-violet-600 hover:text-violet-800 hover:bg-white/50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-6 text-center border-t border-violet-100">
          <p className="text-sm text-violet-700 font-medium mb-2">
            Demo Accounts: admin@school.edu / teacher@school.edu / student@school.edu
          </p>
          <p className="text-xs text-violet-600 bg-white/60 px-3 py-1 rounded-full inline-block">
            Password: {mode === 'login' ? 'admin123, teacher123, student123' : 'any password'}
          </p>
        </div>
      </div>
    </div>
  );
}