import React, { useState } from 'react';
import CourseList from './CourseList';
import AddCourse from './AddCourse';
import ManageDepartments from './ManageDepartments';
import Logout from '../../authComponents/Logout'; // Import Logout component

function AdminDashboard() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isDepartmentCreated, setIsDepartmentCreated] = useState(false);

  const handleDepartmentCreated = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setIsDepartmentCreated(true);
  };

  const handleCourseAdded = () => {
    setIsDepartmentCreated(false);
    setSelectedDepartmentId(null);
    window.location.reload(); // Optionally, refresh the page to update the list of departments and courses
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Logout /> {/* Add Logout button */}
      <div>
        <h2>Manage Departments</h2>
        {!isDepartmentCreated && (
          <ManageDepartments onDepartmentCreated={handleDepartmentCreated} />
        )}
      </div>
      {isDepartmentCreated && selectedDepartmentId && (
        <div>
          <h2>Manage Courses</h2>
          <AddCourse departmentId={selectedDepartmentId} onCourseAdded={handleCourseAdded} />
          <CourseList departmentId={selectedDepartmentId} />
        </div>
      )}
      <div>
        <h2>Manage Users</h2>
        <p>Placeholder for managing users.</p>
      </div>
      <div>
        <h2>Manage Quizzes</h2>
        <p>Placeholder for managing quizzes.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
