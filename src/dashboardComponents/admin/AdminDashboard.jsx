import React, { useState, useEffect } from 'react';
import { getAllDepartments, addDepartment, deleteDepartment, updateDepartment } from '../../services/departmentService';
import AddCourse from './AddCourse';
import CourseList from './CourseList';
import Logout from '../../authComponents/Logout';
import './AdminDashboard.css';

function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [showAddCourseCard, setShowAddCourseCard] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentDescription, setNewDepartmentDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getAllDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim() || !newDepartmentDescription.trim()) {
      setError('Both name and description are required.');
      return;
    }
    try {
      await addDepartment(newDepartmentName, newDepartmentDescription);
      const updatedDepartments = await getAllDepartments();
      setDepartments(updatedDepartments);
      setShowAddDepartmentModal(false);
      setNewDepartmentName('');
      setNewDepartmentDescription('');
      setError('');
    } catch (error) {
      console.error('Error adding department:', error);
      setError('Failed to add department. Please try again.');
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department.id);
    setEditedName(department.name);
    setEditedDescription(department.description);
  };

  const handleSaveDepartment = async (departmentId) => {
    try {
      await updateDepartment(departmentId, { name: editedName, description: editedDescription });
      setEditingDepartment(null);
      const updatedDepartments = await getAllDepartments();
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete);
        const updatedDepartments = await getAllDepartments();
        setDepartments(updatedDepartments);
        setShowDeleteDialog(false);
        setDepartmentToDelete(null);
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const confirmDeleteDepartment = (departmentId) => {
    setDepartmentToDelete(departmentId);
    setShowDeleteDialog(true);
  };

  const handleAddCourse = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setShowAddCourseCard(true);
  };

  const handleCourseAdded = () => {
    setShowAddCourseCard(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#departments">Departments</a></li>
            <li><a href="#progress">Student Progress</a></li>
          </ul>
        </nav>
        <Logout />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-primary" onClick={() => setShowAddDepartmentModal(true)}>Add Department</button>
        </header>

        <section id="departments" className="dashboard-section">
          <h2>Departments</h2>
          <div className="department-cards">
            {departments.map((department) => (
              <div key={department.id} className="department-card">
                {editingDepartment === department.id ? (
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
                    <button onClick={() => handleSaveDepartment(department.id)} className="btn btn-primary">Save</button>
                    <button onClick={() => setEditingDepartment(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                    <div className="card-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleAddCourse(department.id)}
                      >
                        Add Course
                      </button>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditDepartment(department)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => confirmDeleteDepartment(department.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {showAddCourseCard && selectedDepartmentId && (
          <section id="add-course" className="dashboard-section">
            <h2>Add Course for Department</h2>
            <AddCourse departmentId={selectedDepartmentId} onCourseAdded={handleCourseAdded} />
          </section>
        )}

        {selectedDepartmentId && (
          <section id="courses" className="dashboard-section">
            <h2>Courses</h2>
            <CourseList departmentId={selectedDepartmentId} allowEdit={true} />
          </section>
        )}

        {/* Add Department Modal */}
        {showAddDepartmentModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Department</h2>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Department Description"
                value={newDepartmentDescription}
                onChange={(e) => setNewDepartmentDescription(e.target.value)}
              />
              <button onClick={handleAddDepartment} className="btn btn-primary">Add</button>
              <button onClick={() => setShowAddDepartmentModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="delete-dialog">
            <p>Are you sure you want to delete this department?</p>
            <button onClick={handleDeleteDepartment} className="btn btn-delete">Yes</button>
            <button onClick={() => setShowDeleteDialog(false)} className="btn btn-secondary">No</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;