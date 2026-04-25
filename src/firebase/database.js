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
import { db, isFirebaseConfigured } from './config';

const firebaseUnavailableResult = (message = 'Firebase is not configured.') => ({
  success: false,
  error: message
});

// Experience Timeline Management
export const getExperiences = async () => {
  if (!db) {
    return [];
  }

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
  if (!db) {
    return firebaseUnavailableResult();
  }

  try {
    const docRef = await addDoc(collection(db, 'experiences'), experienceData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding experience:', error);
    return { success: false, error: error.message };
  }
};

export const updateExperience = async (id, experienceData) => {
  if (!db) {
    return firebaseUnavailableResult();
  }

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
  if (!db) {
    return firebaseUnavailableResult();
  }

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
  if (!db) {
    return [];
  }

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
  if (!db) {
    return firebaseUnavailableResult('Contact submissions are unavailable until Firebase is configured.');
  }

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
  if (!db) {
    return firebaseUnavailableResult();
  }

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
  if (!db || !isFirebaseConfigured) {
    callback([]);
    return () => {};
  }

  const experiencesRef = collection(db, 'experiences');
  const q = query(experiencesRef, orderBy('startDate', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const experiences = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(experiences);
  });
};

export const subscribeToContactSubmissions = (callback) => {
  if (!db || !isFirebaseConfigured) {
    callback([]);
    return () => {};
  }

  const submissionsRef = collection(db, 'contactSubmissions');
  const q = query(submissionsRef, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(submissions);
  });
};
