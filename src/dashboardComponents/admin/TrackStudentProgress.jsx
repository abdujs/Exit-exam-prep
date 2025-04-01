import React, { useState, useEffect } from 'react';
import { getProgress } from '../../services/progressService';

function TrackStudentProgress({ courseId }) {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const data = await getProgress(courseId);
      setProgressData(data);
    };
    fetchProgress();
  }, [courseId]);

  return (
    <div>
      <h2>Student Progress</h2>
      <ul>
        {progressData.map((progress) => (
          <li key={progress.studentId}>
            Student ID: {progress.studentId}, Progress: {progress.completedModules}/{progress.totalModules} ({progress.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackStudentProgress;
