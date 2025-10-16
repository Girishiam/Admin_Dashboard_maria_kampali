import React from 'react';
import { Link } from 'react-router-dom';

function PasswordResetSuccess() {
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

          {/* Title */}
          <h1 
            className="text-gray-900 font-sf-pro mb-3"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: '120%',
              letterSpacing: '-0.5px',
            }}
          >
            Password Updated Successfully!
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-gray-600 font-sf-pro mb-8"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '150%',
            }}
          >
            Your new password has been saved. You can now continue securely.
          </p>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="inline-block w-full h-[52px] leading-[52px] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#005440' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetSuccess;
