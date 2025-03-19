import { db } from '../config/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getCoursesByDepartment, deleteCourse } from './courseService';

const departmentsCollection = collection(db, "departments");
const usersCollection = collection(db, "users");

// Add a new department
export const addDepartment = async (name, description) => {
  const docRef = await addDoc(collection(db, "departments"), { name, description }); // Store description
  return docRef.id; // Return the department ID
};

// Fetch all departments
export const getAllDepartments = async () => {
  const departmentSnapshot = await getDocs(departmentsCollection);
  return departmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update a department
export const updateDepartment = async (departmentId, updatedData) => {
  await updateDoc(doc(departmentsCollection, departmentId), updatedData);
};

// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const departmentRef = doc(db, 'departments', departmentId);
    const coursesCollection = collection(departmentRef, 'courses'); // Subcollection under the department
    const coursesSnapshot = await getDocs(coursesCollection);

    // Delete all courses in the subcollection
    for (const courseDoc of coursesSnapshot.docs) {
      await deleteDoc(courseDoc.ref);
    }

    // Remove department from enrolledDepartments in users
    const usersSnapshot = await getDocs(query(usersCollection, where('enrolledDepartments', 'array-contains', departmentId)));
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const updatedDepartments = userData.enrolledDepartments.filter(depId => depId !== departmentId);
      await updateDoc(userDoc.ref, { enrolledDepartments: updatedDepartments });
    }

    // Delete the department itself
    await deleteDoc(departmentRef);
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
