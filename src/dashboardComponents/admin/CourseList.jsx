import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, getDocs, doc } from 'firebase/firestore';

function CourseList({ departmentId }) {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const departmentRef = doc(db, 'departments', departmentId);
    const coursesCollection = collection(departmentRef, 'courses');
    const courseSnapshot = await getDocs(coursesCollection);
    const courseList = courseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCourses(courseList);
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
            {course.name} - {course.description}
            {course.fileURL && (
              <div>
                <a href={course.fileURL} target="_blank" rel="noopener noreferrer">View PDF</a>
                {/* Optionally, embed the PDF */}
                {/* <iframe src={course.fileURL} width="100%" height="500px"></iframe> */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
