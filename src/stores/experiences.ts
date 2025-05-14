import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

type Experience = {
    id?: string;
    title: string;
    description: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    technologies: string[];
    createdAt: Date;
    updatedAt?: Date;
}

export const useExperiencesStore = defineStore('experiences', () => {
  const experiences = ref([]);

  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'experiences'));
      experiences.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("experiences", experiences.value);

    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
  };

  const addExperience = async (experienceData: Experience) => {
    try {
      const docRef = await addDoc(collection(db, 'experiences'), {
        ...experienceData,
        createdAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const updateExperience = async (experienceId: string, experienceData: Experience) => {
    try {
      const experienceRef = doc(db, 'experiences', experienceId);
      await updateDoc(experienceRef, {
        ...experienceData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  };

  const deleteExperience = async (experienceId: string) => {
    console.log("experienceId", experienceId);

    try {
      await deleteDoc(doc(db, 'experiences', experienceId));
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  };

  return {
    experiences,
    fetchExperiences,
    addExperience,
    updateExperience,
    deleteExperience
  };
});