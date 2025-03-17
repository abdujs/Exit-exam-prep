import React, { useState, useEffect } from 'react';
import { getAllDepartments, addDepartment, deleteDepartment } from '../../services/departmentService';

function ManageDepartments({ onDepartmentCreated }) {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    const data = await getAllDepartments();
    setDepartments(data);
  };

  const handleAdd = async () => {
    if (!newDepartment.trim()) {
      setError('Department name cannot be empty');
      return;
    }
    try {
      const departmentId = await addDepartment(newDepartment, "Description of the department");
      setNewDepartment('');
      setError('');
      fetchDepartments();
      onDepartmentCreated(departmentId); // Notify parent component
    } catch (error) {
      console.error('Error adding department:', error);
      setError('Failed to add department. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    await deleteDepartment(id);
    fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

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
      <button onClick={handleAdd}>Add Department</button>
      <ul>
        {departments.map(dep => (
          <li key={dep.id}>
            {dep.name}
            <button onClick={() => handleDelete(dep.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDepartments;
