import React, { useState } from 'react';
import Modal from 'react-modal';
import { auth, googleProvider, db } from '../config/firebaseConfig'; // Import Firestore
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from './AuthProvider';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

Modal.setAppElement('#root'); // Set the root element for accessibility

function Signup({ isOpen, onRequestClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { currentUser, setCurrentUser } = useAuth(); // Access currentUser and global state updater
  const [role] = useState('student'); // Default role is 'student'

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('User Created:', userCredential.user);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          role: role // Store the role in Firestore
        });
        setCurrentUser({ ...userCredential.user, role: role }); // Set current user with role
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message);
      });
  };

  const handleGoogleSignup = () => {
    setError('');
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        console.log('Google Sign-In Successful:', result.user);
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          role: role // Store the role in Firestore
        });
        setCurrentUser({ ...result.user, role: role }); // Set current user with role
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Signup Modal">
      <div>
        <h2>Signup</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignup}>
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
          {/* Remove role selection */}
          <button type="submit">Signup with Email</button>
        </form>
        <button onClick={handleGoogleSignup}>Signup with Google</button>
      </div>
    </Modal>
  );
}

export default Signup;
