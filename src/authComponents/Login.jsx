import React, { useState } from 'react';
import { auth, googleProvider, db } from '../config/firebaseConfig'; // Import Firestore
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from './AuthProvider'; // Access the AuthProvider for global state
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

function Login() {
  const { currentUser, setCurrentUser } = useAuth(); // Access currentUser and global state updater
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
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
      });
  };

  const handleGoogleLogin = () => {
    setError('');
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
      });
  };

  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} />;
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit">Login with Email</button>
      </form>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;
