import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, storage } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAdmin = ref(false);
  const resumeUrl = ref('');
  
  // List of admin email addresses
  const adminEmails = ['zelenkooleksii75@gmail.com'];

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user.value = result.user;
      isAdmin.value = adminEmails.includes(result.user.email);
      await loadResumeUrl();
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      isAdmin.value = false;
      resumeUrl.value = '';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const uploadResume = async (file) => {
    try {
      const fileRef = storageRef(storage, 'resume/cv.pdf');
      await uploadBytes(fileRef, file);
      resumeUrl.value = await getDownloadURL(fileRef);
      return resumeUrl.value;
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  };

  const loadResumeUrl = async () => {
    try {
      const fileRef = storageRef(storage, 'resume/cv.pdf');
      resumeUrl.value = await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error loading resume URL:', error);
      resumeUrl.value = '';
    }
  };
  
  return {
    user,
    isAdmin,
    resumeUrl,
    login,
    logout,
    uploadResume,
    loadResumeUrl
  };
});