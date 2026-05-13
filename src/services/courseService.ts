import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface Enrollment {
  userId: string;
  courseId: string;
  progress: ProgressStatus;
  updatedAt: string;
}

export const enrollInCourse = async (enrollment: Enrollment) => {
  return await addDoc(collection(db, "enrollments"), enrollment);
};

export const updateCourseProgress = async (enrollmentId: string, status: ProgressStatus) => {
  const docRef = doc(db, "enrollments", enrollmentId);

  return await updateDoc(docRef, { 
    progress: status,
    updatedAt: new Date().toISOString()
  });
};