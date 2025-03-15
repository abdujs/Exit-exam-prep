import React, { useState, useEffect } from 'react';
import { getAllDepartments, addDepartment, deleteDepartment } from '../../services/departmentService';
import { uploadFile } from '../../services/fileService'; // Import uploadFile function

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDepartments = async () => {
    const data = await getAllDepartments();
    setDepartments(data);
  };

  const handleAdd = async () => {
    await addDepartment(newDepartment, "Description of the department");
    setNewDepartment('');
    fetchDepartments();
  };

  const handleDelete = async (id) => {
    await deleteDepartment(id);
    fetchDepartments();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (departmentId) => {
    if (selectedFile) {
      const url = await uploadFile(selectedFile);
      // Save the URL to the department or course in your database
      console.log(`File uploaded for department ${departmentId}: ${url}`);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div>
      <h1>Manage Departments</h1>
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
            <input type="file" onChange={handleFileChange} />
            <button onClick={() => handleUpload(dep.id)}>Upload PDF</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageDepartments;
