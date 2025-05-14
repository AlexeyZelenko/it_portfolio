import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Hobby {
  id: string;
  title: string;
  description: string;
  type: string; // например, 'music', 'fishing', и т.д.
  equipment: string[];
  photos: string[];
}

export const useHobbiesStore = defineStore('hobbies', () => {
  const hobbies = ref<Hobby[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Получение всех хобби из Firestore
  const fetchHobbies = async () => {
    loading.value = true;
    error.value = null;
    try {
      const hobbiesCollection = collection(db, 'hobbies');
      const hobbiesSnapshot = await getDocs(hobbiesCollection);
      hobbies.value = hobbiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hobby[];
    } catch (err) {
      console.error('Ошибка при загрузке хобби:', err);
      error.value = 'Не удалось загрузить хобби';
    } finally {
      loading.value = false;
    }
  };

  // Добавление нового хобби
  const addHobby = async (hobbyData: Omit<Hobby, 'id'>, photoFiles: File[]) => {
    loading.value = true;
    error.value = null;
    try {
      // Загрузка фотографий в Firebase Storage
      const photoUrls = [];
      for (const file of photoFiles) {
        const photoRef = storageRef(storage, `hobbies/${Date.now()}_${file.name}`);
        await uploadBytes(photoRef, file);
        const photoUrl = await getDownloadURL(photoRef);
        photoUrls.push(photoUrl);
      }

      // Добавление документа в Firestore
      const hobbyWithPhotos = {
        ...hobbyData,
        photos: photoUrls
      };
      const docRef = await addDoc(collection(db, 'hobbies'), hobbyWithPhotos);
      
      // Обновление локального состояния
      hobbies.value.push({
        id: docRef.id,
        ...hobbyWithPhotos
      } as Hobby);
      
      return docRef.id;
    } catch (err) {
      console.error('Ошибка при добавлении хобби:', err);
      error.value = 'Не удалось добавить хобби';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Обновление существующего хобби
  const updateHobby = async (id: string, hobbyData: Partial<Hobby>, newPhotoFiles?: File[]) => {
    loading.value = true;
    error.value = null;
    try {
      const hobbyRef = doc(db, 'hobbies', id);
      const currentHobby = hobbies.value.find(h => h.id === id);
      
      if (!currentHobby) {
        throw new Error('Хобби не найдено');
      }
      
      let updatedPhotos = [...(currentHobby.photos || [])];
      
      // Если есть новые фотографии, загружаем их
      if (newPhotoFiles && newPhotoFiles.length > 0) {
        for (const file of newPhotoFiles) {
          const photoRef = storageRef(storage, `hobbies/${Date.now()}_${file.name}`);
          await uploadBytes(photoRef, file);
          const photoUrl = await getDownloadURL(photoRef);
          updatedPhotos.push(photoUrl);
        }
      }
      
      const updatedHobbyData = {
        ...hobbyData,
        photos: updatedPhotos
      };
      
      // Обновление документа в Firestore
      await updateDoc(hobbyRef, updatedHobbyData);
      
      // Обновление локального состояния
      const index = hobbies.value.findIndex(h => h.id === id);
      if (index !== -1) {
        hobbies.value[index] = {
          ...hobbies.value[index],
          ...updatedHobbyData
        };
      }
      
      return id;
    } catch (err) {
      console.error('Ошибка при обновлении хобби:', err);
      error.value = 'Не удалось обновить хобби';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Удаление хобби
  const deleteHobby = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const hobby = hobbies.value.find(h => h.id === id);
      
      if (!hobby) {
        throw new Error('Хобби не найдено');
      }
      
      // Удаление фотографий из Storage
      for (const photoUrl of hobby.photos) {
        try {
          // Извлекаем путь к файлу из URL
          const photoPath = decodeURIComponent(photoUrl.split('/o/')[1].split('?')[0]);
          const photoRef = storageRef(storage, photoPath);
          await deleteObject(photoRef);
        } catch (photoErr) {
          console.error('Ошибка при удалении фото:', photoErr);
          // Продолжаем удаление других фото и документа
        }
      }
      
      // Удаление документа из Firestore
      await deleteDoc(doc(db, 'hobbies', id));
      
      // Обновление локального состояния
      hobbies.value = hobbies.value.filter(h => h.id !== id);
    } catch (err) {
      console.error('Ошибка при удалении хобби:', err);
      error.value = 'Не удалось удалить хобби';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    hobbies,
    loading,
    error,
    fetchHobbies,
    addHobby,
    updateHobby,
    deleteHobby
  };
});