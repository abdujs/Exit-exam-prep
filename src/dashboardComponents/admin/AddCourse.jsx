import React, { useState } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, addDoc } from 'firebase/firestore';

function AddCourse({ onCourseAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCourse = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'courses'), {
      name,
      description,
    });
    setName('');
    setDescription('');
    onCourseAdded(); // Notify parent to refresh the courses list
  };

  return (
    <form onSubmit={handleAddCourse}>
      <h2>Add New Course</h2>
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
      <button type="submit">Add Course</button>
    </form>
  );
}

export default AddCourse;
