import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursesByDepartment } from '../../services/courseService';
import PDFViewer from '../../commonComponents/PDFViewer'; // Corrected import path
import './CoursePage.css';

function CoursePage() {
  const { departmentId } = useParams(); // Get the department ID from the URL
  const [courses, setCourses] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCoursesByDepartment(departmentId);
      setCourses(data);
    };

    fetchCourses();
  }, [departmentId]);

  const handleNextCourse = () => {
    const currentIndex = courses.findIndex((course) => course.fileURL === selectedPDF);
    const nextCourse = courses[currentIndex + 1];
    if (nextCourse) {
      setSelectedPDF(nextCourse.fileURL);
    } else {
      alert('No more courses available.');
    }
  };

  return (
    <div className="course-page">
      <header className="course-header">
        <h1>Courses</h1>
      </header>

      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            {course.fileURL && (
              <button
                className="btn btn-primary"
                onClick={() => setSelectedPDF(course.fileURL)}
              >
                View PDF
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPDF && (
        <div className="pdf-viewer-container">
          <div className="pdf-viewer-header">
            <button
              onClick={() => setSelectedPDF(null)}
              className="btn btn-secondary"
            >
              Close Viewer
            </button>
            <button onClick={handleNextCourse} className="btn btn-primary">
              Next
            </button>
          </div>
          <PDFViewer fileUrl={selectedPDF} />
        </div>
      )}
    </div>
  );
}

export default CoursePage;
