import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authComponents/AuthProvider';
import Login from '../authComponents/Login';
import Signup from '../authComponents/Signup';
import './LandingPage.css';

function LandingPage() {
  const { currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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
        <h2>Master Your Exit Exam with Confidence!</h2>
        <p>An adaptive learning platform designed for Ethiopian university students to excel in their final exams.</p>
        <button onClick={() => setIsSignupModalOpen(true)} className="btn btn-cta">Start Learning Now</button>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <h3>Key Features</h3>
        <div className="features">
          <div className="feature">
            <h4>Mock Exams & Past Questions</h4>
            <p>Practice with real past questions to prepare effectively.</p>
          </div>
          <div className="feature">
            <h4>Easy Access to Study Materials</h4>
            <p>Get quick and seamless access to all the resources you need.</p>
          </div>
          <div className="feature">
            <h4>Time-Saving Structured Exam Preparation</h4>
            <p>Prepare efficiently with a structured approach tailored to each department.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
        <p>© {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <Login isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
      <Signup isOpen={isSignupModalOpen} onRequestClose={() => setIsSignupModalOpen(false)} />
    </div>
  );
}

export default LandingPage;

