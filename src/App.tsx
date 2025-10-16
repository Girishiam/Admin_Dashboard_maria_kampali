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
import APIs from './pages/APIs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="administrators" element={<Administrators />} />
          <Route path="payment" element={<Payment />} />
          <Route path="apis" element={<APIs />} />
          {/* DO NOT PUT PRIVACY POLICY AND TERMS HERE */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
