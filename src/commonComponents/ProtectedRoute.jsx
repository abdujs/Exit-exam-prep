import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authComponents/AuthProvider'; // Import AuthProvider

function ProtectedRoute({ children, role }) {
  const { currentUser } = useAuth(); // Get the current user from AuthProvider

  if (!currentUser) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} replace />;
  }

  return children;
}

export default ProtectedRoute;
