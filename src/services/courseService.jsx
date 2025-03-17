import { db } from '../config/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const coursesCollection = collection(db, "courses");

// Add a new course
export const addCourse = async (title, description, contentUrl, departmentId, totalModules) => {
  await addDoc(coursesCollection, { title, description, contentUrl, departmentId, totalModules });
};

// Fetch all courses
export const getAllCourses = async () => {
  const coursesSnapshot = await getDocs(coursesCollection);
  return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch courses by department
export const getCoursesByDepartment = async (departmentId) => {
  const courses = await getAllCourses();
  return courses.filter(course => course.departmentId === departmentId);
};

// Delete a course
export const deleteCourse = async (courseId) => {
  await deleteDoc(doc(coursesCollection, courseId));
};