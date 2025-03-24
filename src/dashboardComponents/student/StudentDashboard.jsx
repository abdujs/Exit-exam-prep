import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../../services/departmentService';
import { getCoursesByDepartment } from '../../services/courseService';
import { updateProgress } from '../../services/progressService'; // Import progress service
import Logout from '../../authComponents/Logout'; // Import Logout component
import PDFViewer from '../../commonComponents/PDFViewer'; // Import PDFViewer component

function StudentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null); // State to track the selected PDF
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for confirmation dialog
  const [departmentToEnroll, setDepartmentToEnroll] = useState(null); // Track the department to enroll

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
    setShowConfirmDialog(false); // Close the confirmation dialog
  };

  const confirmEnroll = (departmentId) => {
    setDepartmentToEnroll(departmentId);
    setShowConfirmDialog(true); // Show the confirmation dialog
  };

  const handleMarkProgress = async (courseId, completedModules, totalModules) => {
    await updateProgress(currentUser.uid, courseId, completedModules, totalModules);
    alert('Progress updated!');
  };

  const handleNextCourse = () => {
    const currentIndex = courses.findIndex(course => course.fileURL === selectedPDF);
    const nextCourse = courses[currentIndex + 1];
    if (nextCourse) {
      setSelectedPDF(nextCourse.fileURL);
    } else {
      alert('No more courses available.');
    }
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
              <button onClick={() => confirmEnroll(dep.id)}>Enroll</button>
            </li>
          ))}
        </ul>
      </div>

      {showConfirmDialog && (
        <div style={{ background: '#f9f9f9', padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
          <p>Are you sure you want to enroll in this department?</p>
          <button onClick={() => handleEnroll(departmentToEnroll)}>Yes</button>
          <button onClick={() => setShowConfirmDialog(false)}>No</button>
        </div>
      )}

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
                    <button onClick={() => setSelectedPDF(course.fileURL)}>View PDF</button>
                  )}
                  <button onClick={() => handleMarkProgress(course.id, 1, course.totalModules)}>Mark Progress</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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

export default StudentDashboard;
