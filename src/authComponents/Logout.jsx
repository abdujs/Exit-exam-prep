import React from 'react';
import { useAuth } from './AuthProvider';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        navigate('/login'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Error signing out:', error.message);
      });
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
