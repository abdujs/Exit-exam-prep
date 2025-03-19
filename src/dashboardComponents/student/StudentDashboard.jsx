import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../../services/departmentService';
import { getCoursesByDepartment } from '../../services/courseService';
import { updateProgress } from '../../services/progressService'; // Import progress service
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
    console.log('Fetched courses:', data); // Log the fetched courses
    setCourses(data);
  };

  const handleEnroll = async (departmentId) => {
    if (selectedDepartment === departmentId) {
      alert('You are already enrolled in this department.');
      return;
    }
    setSelectedDepartment(departmentId);
    await fetchCourses(departmentId);
  };

  const handleMarkProgress = async (courseId, completedModules, totalModules) => {
    await updateProgress(currentUser.uid, courseId, completedModules, totalModules);
    alert('Progress updated!');
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
            {courses.map(course => {
              const optimizedFileURL = `${course.fileURL}?q_auto`; // Append q_auto for optimization
              console.log('Optimized Course fileURL:', optimizedFileURL); // Log the optimized fileURL
              return (
                <li key={course.id}>
                  {course.title} - {course.description}
                  {course.fileURL && (
                    <a href={optimizedFileURL} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  )}
                  <button onClick={() => handleMarkProgress(course.id, 1, course.totalModules)}>Mark Progress</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
