import React from 'react';
import CourseList from './CourseList';
import AddCourse from './AddCourse';
import ManageDepartments from './ManageDepartments';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Manage Departments</h2>
        <ManageDepartments />
      </div>
      <div>
        <h2>Manage Courses</h2>
        <AddCourse onCourseAdded={() => window.location.reload()} />
        <CourseList />
      </div>
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
