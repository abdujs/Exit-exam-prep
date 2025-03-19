import { db } from '../config/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { deleteFile } from './fileService'; // Import Cloudinary file deletion service

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
  try {
    const departmentRef = doc(db, 'departments', departmentId); // Reference to the department
    const coursesCollection = collection(departmentRef, 'courses'); // Subcollection under the department
    const coursesSnapshot = await getDocs(coursesCollection);

    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  const courseDoc = await getDoc(doc(db, "courses", courseId));
  if (courseDoc.exists()) {
    const courseData = courseDoc.data();
    if (courseData.fileURL) {
      await deleteFile(courseData.fileURL); // Delete file from Cloudinary
    }
  }
  await deleteDoc(doc(db, "courses", courseId)); // Delete course from Firestore
};