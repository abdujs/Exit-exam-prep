// Code to interact with the progress collection in Firestore
import { db } from '../config/firebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const progressCollection = collection(db, "progress");

// Update progress for a student
export const updateProgress = async (studentId, courseId, completedModules, totalModules) => {
  const progressId = `progress_${studentId}_${courseId}`;
  await setDoc(doc(progressCollection, progressId), {
    studentId,
    courseId,
    completedModules,
    totalModules,
    status: completedModules === totalModules ? "Completed" : "In Progress"
  });
};

// Get progress by student and course
export const getProgress = async (studentId, courseId) => {
  const progressId = `progress_${studentId}_${courseId}`;
  const progressDoc = await getDoc(doc(progressCollection, progressId));
  return progressDoc.exists() ? progressDoc.data() : null;
};
