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
export const deleteCourse = async (departmentId, courseId) => {
  try {
    const departmentRef = doc(db, 'departments', departmentId); // Reference to the department
    const courseRef = doc(collection(departmentRef, 'courses'), courseId); // Reference to the course in the subcollection

    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      const courseData = courseDoc.data();
      if (courseData.publicId) {
        console.log('Deleting file with publicId:', courseData.publicId); // Log the publicId
        try {
          await deleteFile(courseData.publicId); // Delete file from Cloudinary using publicId
        } catch (error) {
          console.error('Failed to delete file from Cloudinary:', error);
        }
      } else {
        console.warn('No publicId found for the course. Skipping Cloudinary deletion.');
      }
    }

    await deleteDoc(courseRef); // Delete course from Firestore
    console.log(`Course ${courseId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};