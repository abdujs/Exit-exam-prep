import React, { useState } from 'react';
import CourseList from './CourseList';
import AddCourse from './AddCourse';
import ManageDepartments from './ManageDepartments';
import Logout from '../../authComponents/Logout'; // Import Logout component
import { getCoursesByDepartment } from '../../services/courseService'; // Import the function to fetch courses

function AdminDashboard() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isDepartmentCreated, setIsDepartmentCreated] = useState(false);

  const handleDepartmentCreated = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setIsDepartmentCreated(true);
  };

  const handleDepartmentEdit = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setIsDepartmentCreated(true); // Show the "Add Course" and "Course List" components
  };

  const handleCourseAdded = async () => {
    const courses = await getCoursesByDepartment(selectedDepartmentId);
    if (courses.length >= 10) {
      setIsDepartmentCreated(false); // Hide the "Add Course" form if 10 or more courses exist
      setSelectedDepartmentId(null);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Logout /> {/* Add Logout button */}
      <div>
        <h2>Manage Departments</h2>
        {!isDepartmentCreated && (
          <ManageDepartments onDepartmentCreated={handleDepartmentCreated} onDepartmentEdit={handleDepartmentEdit} />
        )}
      </div>
      {isDepartmentCreated && selectedDepartmentId && (
        <div>
          <h2>Manage Courses</h2>
          <AddCourse departmentId={selectedDepartmentId} onCourseAdded={handleCourseAdded} />
          <CourseList departmentId={selectedDepartmentId} allowEdit={true} /> {/* Allow editing courses */}
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
      {/* <div>
        <h2>Track Student Progress</h2>
        <TrackStudentProgress courseId={selectedDepartmentId} />
      </div> */}
    </div>
  );
}

export default AdminDashboard;
