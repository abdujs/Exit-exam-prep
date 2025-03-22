import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authComponents/AuthProvider'; // AuthProvider to access currentUser globally
import Login from '../authComponents/Login';
import Signup from '../authComponents/Signup';

function LandingPage() {
  const { currentUser } = useAuth(); // Get the current user from AuthProvider
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Redirect logged-in users to the appropriate dashboard
  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <header style={{ padding: '10px', background: '#f5f5f5' }}>
        <h1>E-Learning Platform</h1>
      </header>

      {/* Main Content */}
      <main style={{ textAlign: 'center', margin: '50px 20px' }}>
        <h2>Welcome to the E-Learning Platform</h2>
        <p>Your one-stop destination for learning and growth.</p>
        <div style={{ margin: '20px 0' }}>
          <button onClick={() => setIsLoginModalOpen(true)} style={{ marginRight: '10px' }}>Login</button>
          <button onClick={() => setIsSignupModalOpen(true)}>Sign Up</button>
        </div>
        <p>Explore our platform to enhance your skills and knowledge.</p>
      </main>

      {/* Footer */}
      <footer style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <Login isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
      <Signup isOpen={isSignupModalOpen} onRequestClose={() => setIsSignupModalOpen(false)} />
    </div>
  );
}

export default LandingPage;

