import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authComponents/AuthProvider'; // AuthProvider to access currentUser globally
import Login from '../authComponents/Login';
import Signup from '../authComponents/Signup';
import './LandingPage.css'; // Import CSS for styling

function LandingPage() {
  const { currentUser } = useAuth(); // Get the current user from AuthProvider
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Redirect logged-in users to the appropriate dashboard
  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />;
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <h1 className="logo">E-Learning Platform</h1>
        <div className="auth-buttons">
          <button onClick={() => setIsLoginModalOpen(true)} className="btn btn-primary">Login</button>
          <button onClick={() => setIsSignupModalOpen(true)} className="btn btn-secondary">Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2>Welcome to the E-Learning Platform</h2>
        <p>Empower your learning journey with our comprehensive courses and resources.</p>
        <button onClick={() => setIsSignupModalOpen(true)} className="btn btn-cta">Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3>Why Choose Us?</h3>
        <div className="features">
          <div className="feature">
            <h4>Expert Instructors</h4>
            <p>Learn from industry experts with years of experience.</p>
          </div>
          <div className="feature">
            <h4>Flexible Learning</h4>
            <p>Access courses anytime, anywhere, at your own pace.</p>
          </div>
          <div className="feature">
            <h4>Comprehensive Resources</h4>
            <p>Get access to a wide range of learning materials and tools.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <Login isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
      <Signup isOpen={isSignupModalOpen} onRequestClose={() => setIsSignupModalOpen(false)} />
    </div>
  );
}

export default LandingPage;

