import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './config';

// Admin login function
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Admin logout function
export const adminLogout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user is admin
export const isAdmin = (user) => {
  return user && user.email === process.env.REACT_APP_ADMIN_EMAIL;
};
