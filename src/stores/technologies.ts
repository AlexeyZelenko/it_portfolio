import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export interface Technology {
  id?: string;
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'other';
  proficiency: number;
  icon: string;
  description?: string;
}

export const useTechnologiesStore = defineStore('technologies', () => {
  const technologies = ref<Technology[]>([]);
  
  const fetchTechnologies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'technologies'));
      technologies.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Technology[];
    } catch (error) {
      console.error('Error fetching technologies:', error);
      throw error;
    }
  };

  const addTechnology = async (technologyData: Omit<Technology, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'technologies'), {
        ...technologyData,
        createdAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Error adding technology:', error);
      throw error;
    }
  };

  const updateTechnology = async (technologyId: string, technologyData: Partial<Technology>) => {
    try {
      const technologyRef = doc(db, 'technologies', technologyId);
      await updateDoc(technologyRef, {
        ...technologyData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating technology:', error);
      throw error;
    }
  };

  const deleteTechnology = async (technologyId: string) => {
    try {
      await deleteDoc(doc(db, 'technologies', technologyId));
    } catch (error) {
      console.error('Error deleting technology:', error);
      throw error;
    }
  };

  return {
    technologies,
    fetchTechnologies,
    addTechnology,
    updateTechnology,
    deleteTechnology
  };
});