import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(digits.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.join('').length !== 6) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to reset password page or dashboard
      navigate('/reset-password');
    }, 1500);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    // Add your resend logic here
    console.log('Resending OTP...');
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-[580px]">
        {/* Verification Card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2.5">
              <div className="w-12 h-12 border-2 border-teal-800 rounded flex items-center justify-center transition-transform hover:scale-105">
                <span className="text-teal-800 font-bold text-2xl">A</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-gray-800 font-bold text-2xl tracking-tight">ALFABETS</span>
                <span className="text-blue-600 font-bold text-2xl">24</span>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-2 mb-8">
            <h1 
              className="text-gray-900 font-sf-pro"
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: '120%',
                letterSpacing: '-0.5px',
              }}
            >
              Check your email
            </h1>
            <p 
              className="text-gray-600 font-sf-pro mt-3"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '150%',
              }}
            >
              We sent a code to your email address @. Please check your email for the 6 digit code.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes - 6 digits */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:border-teal-700 bg-white transition-all duration-200 hover:border-gray-400"
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isComplete || isLoading}
              className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ backgroundColor: '#005440' }}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          {/* Resend Section */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              You have not received the email?{' '}
              <button
                onClick={handleResend}
                className="font-semibold transition-colors duration-200 hover:underline"
                style={{ color: '#005440' }}
              >
                Resend
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link 
              to="/login"
              className="text-sm font-medium transition-colors duration-200 inline-flex items-center"
              style={{ color: '#005440' }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
