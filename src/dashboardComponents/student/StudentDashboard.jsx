import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../../services/departmentService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authComponents/AuthProvider';
import Logout from '../../authComponents/Logout';
import './StudentDashboard.css';

function StudentDashboard() {
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [enrolledDepartment, setEnrolledDepartment] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getAllDepartments();
      setDepartments(data);
    };

    if (currentUser?.enrolledDepartments?.length > 0) {
      setEnrolledDepartment(currentUser.enrolledDepartments[0]); // Assume only one department is allowed
    }

    fetchDepartments();
  }, [currentUser]);

  const handleEnroll = (departmentId) => {
    if (enrolledDepartment) {
      setErrorMessage('Enrolling in multiple departments is not allowed!');
      setShowErrorPopup(true); // Show the error popup
      return;
    }

    // Enrollment logic (if applicable)
  };

  const handleGoToCourse = () => {
    navigate(`/courses/${enrolledDepartment}`); // Navigate to the course page
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <Logout />
      </header>

      <div className="dashboard-content">
        {/* Enrolled Department Section */}
        {enrolledDepartment && (
          <section className="dashboard-section">
            <h2>Enrolled Department</h2>
            <div className="department-card">
              <h3>{departments.find((dep) => dep.id === enrolledDepartment)?.name}</h3>
              <p>{departments.find((dep) => dep.id === enrolledDepartment)?.description}</p>
              <button
                className="btn btn-primary"
                onClick={handleGoToCourse}
              >
                Go to Course
              </button>
            </div>
          </section>
        )}

        {/* Available Departments Section */}
        <section className="dashboard-section">
          <h2>Available Departments</h2>
          <div className="department-cards">
            {departments
              .filter((dep) => dep.id !== enrolledDepartment) // Exclude the enrolled department
              .map((dep) => (
                <div key={dep.id} className="department-card">
                  <h3>{dep.name}</h3>
                  <p>{dep.description}</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEnroll(dep.id)}
                  >
                    Enroll
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* Error Popup */}
        {showErrorPopup && (
          <div className="error-popup">
            <div className="error-popup-content">
              <p style={{ color: 'red' }}>{errorMessage}</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowErrorPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
