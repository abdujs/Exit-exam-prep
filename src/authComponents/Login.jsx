import React, { useState } from 'react';
import Modal from 'react-modal';
import { auth, googleProvider, db } from '../config/firebaseConfig'; // Import Firestore
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from './AuthProvider'; // Access the AuthProvider for global state
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

Modal.setAppElement('#root'); // Set the root element for accessibility

function Login({ isOpen, onRequestClose }) {
  const { currentUser, setCurrentUser } = useAuth(); // Access currentUser and global state updater
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading to true
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('User Logged In:', userCredential.user);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...userCredential.user, ...userDoc.data() }); // Merge user data with Firestore data
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message); // Display error message
      })
      .finally(() => setLoading(false)); // Reset loading state
  };

  const handleGoogleLogin = () => {
    setError('');
    setLoading(true); // Set loading to true
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        console.log('Google Sign-In Successful:', result.user);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...result.user, ...userDoc.data() }); // Merge user data with Firestore data
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message);
      })
      .finally(() => setLoading(false)); // Reset loading state
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />;
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Login Modal">
      <div>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Loading...</p>} {/* Show loading indicator */}
        <form onSubmit={handleLogin}>
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
          <button type="submit" disabled={loading}>Login with Email</button>
        </form>
        <button onClick={handleGoogleLogin} disabled={loading}>Login with Google</button>
      </div>
    </Modal>
  );
}

export default Login;
