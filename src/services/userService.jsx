import { db } from '../config/firebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const usersCollection = collection(db, "users");

// Add a new user
export const addUser = async (userId, name, email, role) => {
  await setDoc(doc(usersCollection, userId), {
    name,
    email,
    role,
    enrolledDepartments: [],
    enrolledCourses: []
  });
};

// Fetch a user by ID
export const getUserById = async (userId) => {
  const userDoc = await getDoc(doc(usersCollection, userId));
  return userDoc.exists() ? userDoc.data() : null;
};

// Update user information
export const updateUser = async (userId, updatedData) => {
  await updateDoc(doc(usersCollection, userId), updatedData);
};
