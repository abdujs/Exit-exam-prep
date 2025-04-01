import React, { useState } from 'react';
import './AuthCard.css'; // Import shared styles for login and signup cards

function Login({ isOpen, onRequestClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="auth-modal">
      <div className="auth-card">
        <button className="close-btn btn btn-primary" onClick={onRequestClose}>×</button>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <span onClick={onRequestClose}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
