import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import AccountSettingsModal from '../components/modals/AccountSettingsModal';
import PasswordChangeModal from '../components/modals/PasswordChangeModal';

// Import custom icons
const menuItems = [
  { path: '/dashboard', icon: '/icons/dashboard_icon.png', label: 'Dashboard' },
  { path: '/users', icon: '/icons/user_icon.png', label: 'User Management' },
  { path: '/administrators', icon: '/icons/admin_icon.png', label: 'Administrators' },
  { path: '/payment', icon: '/icons/payment_icon.png', label: 'Payment' },
  { path: '/subscription', icon: '/icons/payment_icon.png', label: 'Subscription' },
  { path: '/apis', icon: '/icons/api_icon.png', label: "API's" }
];

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  navigate('/login');
};

  return (
    <div className="flex min-h-screen bg-[#E6F0F5]">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        w-[240px] bg-white flex flex-col border-r border-gray-200 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2" style={{ height: '46px' }}>
            <div className="w-10 h-10 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#005440' }}>
              <span className="font-bold text-xl" style={{ color: '#005440' }}>A</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-gray-900 font-bold text-xl">ALFABETS</span>
              <span className="text-blue-600 font-bold text-xl">24</span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg transition-colors ml-2"
            style={{ backgroundColor: '#005440' }}
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <nav className="flex-1 px-3 pt-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  {isActive && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full"
                      style={{ backgroundColor: '#005440' }}
                    />
                  )}
                  
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 ml-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#005440] text-white rounded-xl font-semibold' 
                        : 'text-gray-800 hover:bg-gray-100 rounded-lg font-medium'
                    }`}
                    style={{
                      fontSize: '14px',
                      letterSpacing: '0.3px',
                      gap: '12px',
                    }}
                  >
                    {/* Use PNG icon instead of Heroicon */}
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={`w-[20px] h-[20px] flex-shrink-0 ${isActive ? 'brightness-0 invert' : 'opacity-70'}`}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="px-6 py-4 mt-auto text-xs text-gray-700 border-t border-gray-100" style={{ fontSize: '11px' }}>
        <div className="flex items-center gap-2">
            <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">
            Privacy & Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/terms-conditions" className="hover:text-gray-900 transition-colors">
            Terms & Conditions
            </Link>
        </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        <header className="bg-white px-4 sm:px-6 md:px-8 py-3 flex justify-between lg:justify-end items-center border-b border-gray-200 z-30 sticky top-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-white border border-gray-200 rounded-xl flex items-center px-3 md:px-4 py-2 gap-2 md:gap-3 shadow-sm hover:border-gray-300 transition-all"
            >
              <img
                src="https://ui-avatars.com/api/?name=Ovie+Rahaman&background=005440&color=fff&rounded=true&size=60"
                alt="User"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
              />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="font-bold text-gray-900 text-[13px] md:text-[14px]">Ovie Rahaman</span>
                <span className="text-gray-500 text-[11px] md:text-[12px] font-medium">Super Admin</span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] py-2">
                <button 
                  onClick={() => { setShowAccountModal(true); setShowDropdown(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 text-sm transition-colors font-medium"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 text-sm transition-colors font-medium"
                >
                  <KeyIcon className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
                <hr className="my-2 border-gray-200"/>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm transition-colors rounded-b-xl font-medium"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>
        
        <main className="relative flex-1 min-h-0 p-4 sm:p-5 md:p-6 lg:p-8 bg-[#E6F0F5] overflow-auto">
          <div className="absolute right-0 top-0 z-0 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[550px] xl:w-[600px] pointer-events-none opacity-30">
            <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M600 0C450 50 300 150 200 300C150 375 75 450 0 400V0H600Z" fill="url(#curveGradient)"/>
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="600" y2="400" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#A7F3D0"/>
                  <stop offset="100%" stopColor="#BFDBFE"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <AccountSettingsModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)}
        onOpenPasswordModal={() => {
          setShowAccountModal(false);
          setShowPasswordModal(true);
        }}
      />
      <PasswordChangeModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}

export default DashboardLayout;
