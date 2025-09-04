import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onResendVerification: () => Promise<void>;
}

export function EmailVerification({ 
  email, 
  onVerificationComplete, 
  onResendVerification 
}: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      await onResendVerification();
      setResendCooldown(60); // 60 second cooldown
    } catch {
      setError('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      // This would call the backend verification endpoint
      // For now, simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') {
        onVerificationComplete();
      } else {
        setError('Invalid verification code');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <div className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full p-4 shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Verify Your Email
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            We've sent a verification code to <strong className="text-emerald-600">{email}</strong>. 
            Please check your inbox and enter the code below.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-slate-700 mb-3">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl text-center text-xl font-mono tracking-widest focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-gradient-to-r from-white to-emerald-50"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 flex items-center animate-pulse">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              isLoading={isVerifying}
              disabled={verificationCode.length !== 6}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Verify Email
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-emerald-100">
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              isLoading={isResending}
              className="border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl py-3 font-semibold transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Code'
              }
            </Button>
          </div>

          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-emerald-800 font-medium">
              <strong>Demo:</strong> Use code <code className="bg-emerald-100 px-2 py-1 rounded-lg font-mono text-emerald-700">123456</code> to verify
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
