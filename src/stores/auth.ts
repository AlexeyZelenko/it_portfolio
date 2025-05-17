import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { auth, storage } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage';

type User = FirebaseUser | null;

interface AuthStore {
  user: Ref<User>;
  isAdmin: Ref<boolean>;
  resumeUrl: Ref<string>;
  login: () => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
  uploadResume: (file: File) => Promise<string>;
  loadResumeUrl: () => Promise<void>;
}

export const useAuthStore = defineStore('auth', (): AuthStore => {
  const user = ref<User>(null);
  const isAdmin = ref<boolean>(false);
  const resumeUrl = ref<string>('');

  // List of admin email addresses
  const adminEmails: string[] = ['zelenkooleksii75@gmail.com'];

  const login = async (): Promise<FirebaseUser | null> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user.value = result?.user || null;
      isAdmin.value = result?.user?.email ? adminEmails.includes(result.user.email) : false;
      await loadResumeUrl();
      return result?.user || null;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      user.value = null;
      isAdmin.value = false;
      resumeUrl.value = '';
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    try {
      const fileRef: StorageReference = storageRef(storage, 'resume/cv.pdf');
      await uploadBytes(fileRef, file);
      resumeUrl.value = await getDownloadURL(fileRef);
      return resumeUrl.value;
    } catch (error: any) {
      console.error('Resume upload error:', error);
      throw error;
    }
  };

  const loadResumeUrl = async (): Promise<void> => {
    try {
      const fileRef: StorageReference = storageRef(storage, 'resume/Resume.pdf');
      resumeUrl.value = await getDownloadURL(fileRef);
    } catch (error: any) {
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
    loadResumeUrl,
  };
});