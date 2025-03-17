import React, { useState } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, addDoc, doc } from 'firebase/firestore';
import { uploadFile } from '../../services/fileService'; // Import uploadFile function

function AddCourse({ departmentId, onCourseAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      let fileURL = '';
      if (selectedFile) {
        fileURL = await uploadFile(selectedFile, { name, description }, departmentId);
      }
      const departmentRef = doc(db, 'departments', departmentId);
      await addDoc(collection(departmentRef, 'courses'), {
        name,
        description,
        fileURL,
      });
      setName('');
      setDescription('');
      setSelectedFile(null);
      onCourseAdded(); // Notify parent to refresh the courses list
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course. Please try again.');
    }
  };

  return (
    <form onSubmit={handleAddCourse}>
      <h2>Add New Course</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Course Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button type="submit">Add Course</button>
    </form>
  );
}

export default AddCourse;
