import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../../services/departmentService';
import { getCoursesByDepartment } from '../../services/courseService';
import Logout from '../../authComponents/Logout'; // Import Logout component

function StudentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [courses, setCourses] = useState([]);

  const fetchDepartments = async () => {
    const data = await getAllDepartments();
    setDepartments(data);
  };

  const fetchCourses = async (departmentId) => {
    const data = await getCoursesByDepartment(departmentId);
    setCourses(data);
  };

  const handleEnroll = async (departmentId) => {
    // Ensure the student can only enroll in one department at a time
    if (selectedDepartment) {
      alert('You are already enrolled in a department.');
      return;
    }
    setSelectedDepartment(departmentId);
    await fetchCourses(departmentId);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Student Dashboard</h1>
      <Logout /> {/* Add Logout button */}
      <p>Welcome to your dashboard! Here you can find all your enrolled courses, track progress, and access important announcements.</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Available Departments</h2>
        <ul>
          {departments.map(dep => (
            <li key={dep.id}>
              {dep.name}
              <button onClick={() => handleEnroll(dep.id)}>Enroll</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedDepartment && (
        <div style={{ marginTop: '20px' }}>
          <h2>Courses in {departments.find(dep => dep.id === selectedDepartment)?.name}</h2>
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                {course.title} - {course.description}
                {course.fileURL && (
                  <a href={course.fileURL} target="_blank" rel="noopener noreferrer">View PDF</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
