import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([]);
  
  const fetchProjects = async () => {
    console.log('Fetching projects...');
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      projects.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };

  const addProject = async (projectData, imagesWithDescriptions) => {
    try {
      const imageUrlsWithDescriptions = [];

      // Если есть изображения для загрузки
      if (imagesWithDescriptions && imagesWithDescriptions.length > 0) {
        await Promise.all(
            imagesWithDescriptions.map(async (item) => {
              if (item.file) {
                const storageReference = storageRef(storage, `projects/${item.file.name}_${Date.now()}`);
                await uploadBytesToStorage(storageReference, item.file);
                const url = await getDownloadURLFromStorage(storageReference);
                imageUrlsWithDescriptions.push({ url, description: item.description || '' });
              } else if (item.url) {
                // Если это существующее изображение (при редактировании), просто сохраняем его URL и описание
                imageUrlsWithDescriptions.push({ url: item.url, description: item.description || '' });
              }
            })
        );
      }

      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        images: imageUrlsWithDescriptions, // Сохраняем массив объектов с URL и описаниями
        createdAt: new Date()
      });

      return docRef;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const projectDocRef = doc(db, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDocRef);
      const projectData = projectSnapshot.data();

      if (projectData && projectData.images && Array.isArray(projectData.images)) {
        // Получаем массив объектов с URL и описанием
        const imagesToDelete = projectData.images.filter(img => img.url); // Фильтруем только с URL

        // Удаляем каждое изображение из Firebase Storage
        await Promise.all(
            imagesToDelete.map(async (image) => {
              const storageReference = storageRef(storage, image.url);
              try {
                await deleteObject(storageReference);
                console.log(`Successfully deleted image: ${image.url}`);
              } catch (storageError) {
                console.error(`Error deleting image ${image.url}:`, storageError);
                // Решите, хотите ли вы прерывать удаление всего проекта, если не удалось удалить изображение.
                // В данном примере мы просто логируем ошибку и продолжаем.
              }
            })
        );
      }

      // Удаляем документ проекта из Firestore
      await deleteDoc(projectDocRef);
      // projects.value = projects.value.filter(p => p.id !== projectId); // Эту логику лучше оставить в компоненте

    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const updateProject = async (projectId, projectData, imagesWithDescriptions) => {
    console.log('Updating project:', imagesWithDescriptions);
    try {
      const imageUrlsWithDescriptions = [];

      if (imagesWithDescriptions && imagesWithDescriptions.length > 0) {
        await Promise.all(
            imagesWithDescriptions.map(async (item) => {
              if (item.file) {
                const storageReference = storageRef(storage, `projects/${item.file.name}_${Date.now()}`);
                await uploadBytesToStorage(storageReference, item.file);
                const url = await getDownloadURLFromStorage(storageReference);
                imageUrlsWithDescriptions.push({ url, description: item.description || '' });
              } else if (item.url) {
                imageUrlsWithDescriptions.push({ url: item.url, description: item.description || '' });
              }
            })
        );
      }

      // Обновляем документ, исключая временные данные об изображениях
      const projectRef = doc(db, 'projects', projectId);
      const updatePayload = { ...projectData, updatedAt: new Date() };

      // Если есть новые или обновленные изображения, обновляем и массив images
      if (imageUrlsWithDescriptions.length > 0) {
        updatePayload.images = imageUrlsWithDescriptions;
      }

      await updateDoc(projectRef, updatePayload);

    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const fetchProjectDetails = (projectId) => {
    console.log('Fetching project details for ID:', projectId);
    return projects.value.find(p => p.id === projectId);
  };
  
  return {
    projects,
    fetchProjects,
    addProject,
    deleteProject,
    updateProject,
    fetchProjectDetails
  };
});