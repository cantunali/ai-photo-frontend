import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import MainApp from './components/MainApp';
import AdminPanel from './components/AdminPanel';
import PremiumPage from './components/PremiumPage';
import LandingPage from './components/LandingPage';

// Ana uygulama bileşeni (orijinal App.jsx içeriği)
const PhotoTransformApp = () => {
  return <MainApp />;
};

// Ana App bileşeni routing ile
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route 
            path="/premium" 
            element={
              <ProtectedRoute>
                <PremiumPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <PhotoTransformApp />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;