import React, { useState } from 'react';
import Modal from 'react-modal';
import './AuthCard.css'; // Import shared styles for login and signup cards
import { auth, googleProvider, db } from '../config/firebaseConfig'; // Import Firestore
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from './AuthProvider';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

Modal.setAppElement('#root'); // Set the root element for accessibility

function Signup({ isOpen, onRequestClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { currentUser, setCurrentUser } = useAuth(); // Access currentUser and global state updater

  if (!isOpen) return null;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userDoc = await getDoc(doc(db, 'users', email)); // Check if the user already exists
      if (userDoc.exists()) {
        setError('User already exists. Please log in.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User Created:', userCredential.user);
      const role = email === 'abdu12.aau@gmail.com' ? 'admin' : 'student'; // Assign role based on email
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        role, // Use the determined role
      });
      setCurrentUser({ ...userCredential.user, role }); // Set current user with the determined role
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign-In Successful:', result.user);

      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        const role = result.user.email === 'abdu12.aau@gmail.com' ? 'admin' : 'student'; // Assign role based on email
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          role, // Use the determined role
        });
      }
      setCurrentUser({ ...result.user, ...userDoc.data() }); // Set current user with the determined role
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />;
  }

  return (
    <div className="auth-modal">
      <div className="auth-card">
        <button className="close-btn" onClick={onRequestClose}>×</button>
        <h2>Sign Up</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <button onClick={handleGoogleSignup} className="btn btn-secondary">Signup with Google</button>
        <p className="auth-footer">
          Already have an account? <span onClick={onRequestClose}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
