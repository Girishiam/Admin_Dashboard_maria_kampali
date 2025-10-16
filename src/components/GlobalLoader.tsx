import React from 'react';

function GlobalLoader() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#E6F0F5' }}
    >
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-10 shadow-lg">
          {/* Logo - Same as Login */}
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

          {/* Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                style={{ 
                  borderTopColor: '#005440',
                  borderRightColor: '#005440'
                }}
              ></div>
            </div>
          </div>

          {/* Loading Text - Subtle and Clean */}
          <p className="text-center text-gray-600 font-medium text-base">
            Loading<span className="animate-pulse">...</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GlobalLoader;
