import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  
  const fetchDepartments = async () => {
    const departmentsCollection = collection(db, 'departments');
    const departmentSnapshot = await getDocs(departmentsCollection);
    const departmentList = departmentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setDepartments(departmentList);
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'departments'), { name: newDepartment });
    setNewDepartment('');
    fetchDepartments();
  };

  const handleDeleteDepartment = async (id) => {
    await deleteDoc(doc(db, 'departments', id));
    fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <h2>Manage Departments</h2>
      <form onSubmit={handleAddDepartment}>
        <input
          type="text"
          placeholder="Department Name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          required
        />
        <button type="submit">Add Department</button>
      </form>
      <ul>
        {departments.map(department => (
          <li key={department.id}>
            {department.name}
            <button onClick={() => handleDeleteDepartment(department.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDepartments;
