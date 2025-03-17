import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './commonComponents/LandingPage'; // Landing page with nested Login/Signup
import Login from './authComponents/Login'; // Login page
import Signup from './authComponents/Signup'; // Signup page
import AdminDashboard from './dashboardComponents/admin/AdminDashboard'; // Admin dashboard
import StudentDashboard from './dashboardComponents/student/StudentDashboard'; // Student dashboard
import ProtectedRoute from './commonComponents/ProtectedRoute'; // Protected route component
import { AuthProvider } from './authComponents/AuthProvider'; // Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap the Router with AuthProvider */}
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />}>
            <Route path="login" element={<Login />} /> {/* Login page nested under LandingPage */}
            <Route path="signup" element={<Signup />} /> {/* Signup page nested under LandingPage */}
          </Route>

          {/* Admin Dashboard - Protected */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard - Protected */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
