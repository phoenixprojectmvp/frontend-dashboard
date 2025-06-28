import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // אם המשתמש לא מחובר, בצע הפנייה (redirect) לעמוד הלוגין
    return <Navigate to="/login" replace />;
  }

  // אם המשתמש כן מחובר, הצג את העמוד המבוקש (למשל, הדאשבורד)
  return <Outlet />;
}

export default ProtectedRoute;