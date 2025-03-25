import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import PDFViewer from '../../commonComponents/PDFViewer';
import { deleteCourse } from '../../services/courseService';

function CourseList({ departmentId, allowEdit }) {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);

  useEffect(() => {
    if (!departmentId) return;

    const departmentRef = doc(db, 'departments', departmentId);
    const coursesCollection = collection(departmentRef, 'courses');

    const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [departmentId]);

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
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(departmentId, courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete the course. Please try again.');
      }
    }
  };

  const handleNextCourse = () => {
    const currentIndex = courses.findIndex((course) => course.fileURL === selectedPDF);
    const nextCourse = courses[currentIndex + 1];
    if (nextCourse) {
      setSelectedPDF(nextCourse.fileURL);
    } else {
      alert('No more courses available.');
    }
  };

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
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
                  <>
                    <button onClick={() => handleEdit(course)}>Edit</button>
                    <button onClick={() => handleDelete(course.id)}>Delete</button>
                  </>
                )}
                {course.fileURL && (
                  <button onClick={() => setSelectedPDF(course.fileURL)}>View PDF</button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {selectedPDF && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setSelectedPDF(null)}>Close Viewer</button>
            <button onClick={handleNextCourse}>Next</button>
          </div>
          <h2>PDF Viewer</h2>
          <PDFViewer fileUrl={selectedPDF} />
        </div>
      )}
    </div>
  );
}

export default CourseList;
