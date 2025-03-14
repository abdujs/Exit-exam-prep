import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig'; // Ensure the correct path
import { collection, getDocs } from 'firebase/firestore';

function CourseList() {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const coursesCollection = collection(db, 'courses');
    const courseSnapshot = await getDocs(coursesCollection);
    const courseList = courseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCourses(courseList);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name} - {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
