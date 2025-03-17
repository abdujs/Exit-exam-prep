import { db } from '../config/firebaseConfig';
import { collection, doc, addDoc, getDocs } from 'firebase/firestore';

const quizzesCollection = collection(db, "quizzes");

// Add a new quiz
export const addQuiz = async (courseId, title, questions) => {
  await addDoc(quizzesCollection, { courseId, title, questions });
};

// Fetch quizzes by course
export const getQuizzesByCourse = async (courseId) => {
  const quizzesSnapshot = await getDocs(quizzesCollection);
  return quizzesSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(quiz => quiz.courseId === courseId);
};
