import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, storage } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from 'firebase/storage';

// Определение интерфейсов для структур данных
interface ImageWithDescription {
  file?: File | null;
  url?: string;
  description?: string;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  technologies: string;
  liveUrl?: string;
  sourceUrl?: string;
  images: { url: string; description: string }[];
  createdAt: Date;
  updatedAt?: Date;
  [key: string]: any;

}

// Вспомогательные функции для работы со Storage (можно вынести в отдельный модуль)
const uploadBytesToStorage = async (
    storageReference: StorageReference,
    file: File
): Promise<void> => {
  await uploadBytes(storageReference, file);
};

const getDownloadURLFromStorage = async (
    storageReference: StorageReference
): Promise<string> => {
  return await getDownloadURL(storageReference);
};

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);

  const fetchProjects = async (): Promise<void> => {
    console.log('Fetching projects...');
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      //@ts-ignore
      projects.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>), // Приводим данные к типу Project, исключая 'id'
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };

  const addProject = async (
      projectData: Omit<Project, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
      imagesWithDescriptions: ImageWithDescription[]
  ): Promise<any> => {
    try {
      const imageUrlsWithDescriptions: { url: string; description: string }[] = [];

      if (imagesWithDescriptions && imagesWithDescriptions.length > 0) {
        await Promise.all(
            imagesWithDescriptions.map(async (item) => {
              if (item.file) {
                const storageReference = storageRef(
                    storage,
                    `projects/${item.file.name}_${Date.now()}`
                );
                await uploadBytesToStorage(storageReference, item.file);
                const url = await getDownloadURLFromStorage(storageReference);
                imageUrlsWithDescriptions.push({ url, description: item.description || '' });
              } else if (item.url) {
                imageUrlsWithDescriptions.push({ url: item.url, description: item.description || '' });
              }
            })
        );
      }

      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        images: imageUrlsWithDescriptions,
        createdAt: new Date(),
      });

      return docRef;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      const projectDocRef = doc(db, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDocRef);
      const projectData = projectSnapshot.data() as Project | undefined;

      if (projectData?.images?.length) {
        await Promise.all(
            projectData.images.map(async (image) => {
              try {
                const storageReference = storageRef(storage, image.url);
                await deleteObject(storageReference);
                console.log(`Successfully deleted image: ${image.url}`);
              } catch (storageError: any) {
                console.error(`Error deleting image ${image.url}:`, storageError);
                // Можно добавить логику обработки ошибок удаления изображений
              }
            })
        );
      }

      await deleteDoc(projectDocRef);
      // Логику обновления `projects.value` лучше оставить в компоненте
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const updateProject = async (
      projectId: string,
      projectData: Omit<Project, 'id' | 'images' | 'createdAt' | 'updatedAt'>,
      imagesWithDescriptions: ImageWithDescription[]
  ): Promise<void> => {
    console.log('Updating project:', imagesWithDescriptions);
    try {
      const imageUrlsWithDescriptions: { url: string; description: string }[] = [];

      if (imagesWithDescriptions && imagesWithDescriptions.length > 0) {
        await Promise.all(
            imagesWithDescriptions.map(async (item) => {
              if (item.file) {
                const storageReference = storageRef(
                    storage,
                    `projects/${item.file.name}_${Date.now()}`
                );
                await uploadBytesToStorage(storageReference, item.file);
                const url = await getDownloadURLFromStorage(storageReference);
                imageUrlsWithDescriptions.push({ url, description: item.description || '' });
              } else if (item.url) {
                imageUrlsWithDescriptions.push({ url: item.url, description: item.description || '' });
              }
            })
        );
      }

      const projectRef = doc(db, 'projects', projectId);
      const updatePayload: Partial<Project> = { ...projectData, updatedAt: new Date() };

      if (imageUrlsWithDescriptions.length > 0) {
        updatePayload.images = imageUrlsWithDescriptions;
      }

      await updateDoc(projectRef, updatePayload);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const fetchProjectDetails = (projectId: string): Project | undefined => {
    console.log('Fetching project details for ID:', projectId);
    return projects.value.find((p) => p.id === projectId);
  };

  return {
    projects,
    fetchProjects,
    addProject,
    deleteProject,
    updateProject,
    fetchProjectDetails,
  };
});