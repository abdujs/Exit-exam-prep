import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Import updateDoc for editing courses

function CourseList({ departmentId, allowEdit }) {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null); // Track the course being edited
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const fetchCourses = async () => {
    try {
      const departmentRef = doc(db, 'departments', departmentId); // Reference to the department
      const coursesCollection = collection(departmentRef, 'courses'); // Subcollection under the department
      const courseSnapshot = await getDocs(coursesCollection);

      const courseList = courseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course.id);
    setEditedName(course.name);
    setEditedDescription(course.description);
  };

  const handleSave = async (courseId) => {
    try {
      const departmentRef = doc(db, 'departments', departmentId);
      const courseRef = doc(collection(departmentRef, 'courses'), courseId);
      await updateDoc(courseRef, { name: editedName, description: editedDescription });
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, name: editedName, description: editedDescription } : course
        )
      ); // Update state directly
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [departmentId]);

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {editingCourse === course.id ? (
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <button onClick={() => handleSave(course.id)}>Save</button>
                <button onClick={() => setEditingCourse(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {course.name} - {course.description}
                {allowEdit && (
                  <button onClick={() => handleEdit(course)}>Edit</button>
                )}
                {course.fileURL && (
                  <div>
                    <a href={`${course.fileURL}?q_auto`} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                    {/* Optionally, embed the PDF */}
                    {/* <iframe src={`${course.fileURL}?q_auto`} width="100%" height="500px"></iframe> */}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
