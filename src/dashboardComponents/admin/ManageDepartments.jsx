import React, { useState, useEffect } from 'react';
import { getAllDepartments, addDepartment, deleteDepartment } from '../../services/departmentService';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

function ManageDepartments({ onDepartmentCreated, onDepartmentEdit }) {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [newDescription, setNewDescription] = useState(''); // State for department description
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDepartments(data);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleAdd = async () => {
    if (!newDepartment.trim() || !newDescription.trim()) {
      setError('Both name and description are required.');
      return;
    }
    try {
      const departmentId = await addDepartment(newDepartment, newDescription);
      setNewDepartment('');
      setNewDescription('');
      setError('');
      if (onDepartmentCreated) onDepartmentCreated(departmentId);
    } catch (error) {
      console.error('Error adding department:', error);
      setError('Failed to add department. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
      } catch (error) {
        console.error('Error deleting department:', error);
        setError('Failed to delete department. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Manage Departments</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={newDepartment}
        onChange={(e) => setNewDepartment(e.target.value)}
        placeholder="Department Name"
      />
      <input
        type="text"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Department Description"
      />
      <button onClick={handleAdd}>Add Department</button>
      <ul>
        {departments.map((dep) => (
          <li key={dep.id}>
            {dep.name}
            <button onClick={() => handleDelete(dep.id)}>Delete</button>
            <button onClick={() => onDepartmentEdit(dep.id)}>Edit</button> {/* Edit button */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDepartments;
