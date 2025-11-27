import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Administrators from './pages/Administrators';
import Payment from './pages/Payment';
import Subscription from './pages/Subscription';
import APIs from './pages/APIs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (check auth, fetch initial data, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Show loader for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen
  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        
        {/* Standalone Pages - NO DASHBOARD LAYOUT */}
        <Route 
          path="/privacy-policy" 
          element={
            <ProtectedRoute>
              <PrivacyPolicy />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/terms-conditions" 
          element={
            <ProtectedRoute>
              <TermsConditions />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Dashboard Routes - WITH DASHBOARD LAYOUT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Users />} />
        </Route>

        <Route
          path="/administrators"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Administrators />} />
        </Route>

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Payment />} />
        </Route>

        <Route
          path="/apis"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<APIs />} />
        </Route>

        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Subscription />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
