import { storage } from '../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

// Upload a file to Firebase Storage and save course data to Firestore
export const uploadFile = async (file, courseData, departmentId) => {
  try {
    const storageRef = ref(storage, `pdfs/${departmentId}/${file.name}`);
    await uploadBytes(storageRef, file);
    console.log('File uploaded to Firebase Storage');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    // Save course data to Firestore
    const courseCollectionRef = collection(db, 'courses');
    await addDoc(courseCollectionRef, {
      ...courseData,
      fileURL: downloadURL,
      departmentId,
      createdAt: new Date()
    });
    console.log('File URL saved to Firestore');

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
