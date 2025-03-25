import React, { useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc, doc } from 'firebase/firestore';
import { uploadFile } from '../../services/fileService';
import { getCoursesByDepartment } from '../../services/courseService';

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
      const existingCourses = await getCoursesByDepartment(departmentId);
      if (existingCourses.length >= 18) {
        setError('A department cannot have more than 18 courses.');
        return;
      }

      let fileData = { secureUrl: '', publicId: '' };
      if (selectedFile) {
        try {
          fileData = await uploadFile(selectedFile); // Upload file to Cloudinary
        } catch (error) {
          setError('Failed to upload file. Please try again.');
          return;
        }
      }

      const departmentRef = doc(db, 'departments', departmentId); // Reference to the department
      const coursesCollection = collection(departmentRef, 'courses'); // Subcollection under the department

      await addDoc(coursesCollection, {
        name,
        description,
        fileURL: fileData.secureUrl, // Store the secure URL
        publicId: fileData.publicId, // Store the public ID
      });

      setName('');
      setDescription('');
      setSelectedFile(null);
      setError('');
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
        required
      />
      <button type="submit">Add Course</button>
    </form>
  );
}

export default AddCourse;
