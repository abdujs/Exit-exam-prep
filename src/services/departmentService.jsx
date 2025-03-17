import { db } from '../config/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const departmentsCollection = collection(db, "departments");

// Add a new department
export const addDepartment = async (name, description) => {
  const docRef = await addDoc(departmentsCollection, { name, description });
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
  await deleteDoc(doc(departmentsCollection, departmentId));
};
