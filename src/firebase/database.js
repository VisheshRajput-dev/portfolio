import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

// Experience Timeline Management
export const getExperiences = async () => {
  try {
    const experiencesRef = collection(db, 'experiences');
    const q = query(experiencesRef, orderBy('startDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting experiences:', error);
    return [];
  }
};

export const addExperience = async (experienceData) => {
  try {
    const docRef = await addDoc(collection(db, 'experiences'), experienceData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding experience:', error);
    return { success: false, error: error.message };
  }
};

export const updateExperience = async (id, experienceData) => {
  try {
    const experienceRef = doc(db, 'experiences', id);
    await updateDoc(experienceRef, experienceData);
    return { success: true };
  } catch (error) {
    console.error('Error updating experience:', error);
    return { success: false, error: error.message };
  }
};

export const deleteExperience = async (id) => {
  try {
    await deleteDoc(doc(db, 'experiences', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting experience:', error);
    return { success: false, error: error.message };
  }
};

// Contact Form Submissions Management
export const getContactSubmissions = async () => {
  try {
    const submissionsRef = collection(db, 'contactSubmissions');
    const q = query(submissionsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    return [];
  }
};

export const addContactSubmission = async (submissionData) => {
  try {
    const docRef = await addDoc(collection(db, 'contactSubmissions'), {
      ...submissionData,
      timestamp: new Date(),
      status: 'new'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding contact submission:', error);
    return { success: false, error: error.message };
  }
};

export const updateSubmissionStatus = async (id, status) => {
  try {
    const submissionRef = doc(db, 'contactSubmissions', id);
    await updateDoc(submissionRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating submission status:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToExperiences = (callback) => {
  const experiencesRef = collection(db, 'experiences');
  const q = query(experiencesRef, orderBy('startDate', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const experiences = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(experiences);
  });
};

export const subscribeToContactSubmissions = (callback) => {
  const submissionsRef = collection(db, 'contactSubmissions');
  const q = query(submissionsRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(submissions);
  });
};
