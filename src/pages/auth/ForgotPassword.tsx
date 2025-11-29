import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetOtp, LoginError } from '../../services/api_call';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetOtp(email);
      // Navigate to OTP verification with email in state
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      const errorData = err as LoginError;
      setError(errorData.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
        style={{ backgroundColor: '#E6F0F5' }}
      >
        <div className="w-full max-w-[520px]">
          {/* Success Card */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg text-center">
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

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 
              className="text-gray-900 font-sf-pro mb-3"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: '120%',
                letterSpacing: '-0.5px',
              }}
            >
              Check Your Email
            </h1>
            
            <p 
              className="text-gray-600 font-sf-pro mb-6"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '150%',
              }}
            >
              We've sent a verification code to <strong>{email}</strong>
            </p>

            <Link
              to="/login"
              className="inline-block w-full h-[52px] leading-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#005440' }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" 
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-[520px]">
        {/* Forgot Password Card */}
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
              Forget Password?
            </h1>
            <p 
              className="text-gray-600 font-sf-pro mt-3"
              style={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '150%',
              }}
            >
              Please enter your email to get verification code
            </p>
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mt-4">
                {error}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-left text-gray-900 font-semibold text-sm"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="esteban_schiller@gmail.com"
                required
                className="w-full h-[52px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:border-teal-700 bg-white transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#005440' }}
            >
              {isLoading ? 'Sending...' : 'Continue'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
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

export default ForgotPassword;
