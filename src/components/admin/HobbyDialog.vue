<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useHobbiesStore } from '../../stores/hobbies';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Chips from 'primevue/chips';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { Hobby } from '../../types/hobby';

// Определение типов
interface HobbyType {
  name: string;
  value: string;
}

interface Props {
  visible: boolean;
  hobby: Hobby | null;
}

interface FileUploadEvent {
  files: File[];
}

// Определение пропсов
const props = defineProps<Props>();

// Определение эмиттеров
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'saved': [];
}>();

const hobbiesStore = useHobbiesStore();
const toast = useToast();
const isLoading = ref<boolean>(false);
const fileUploadRef = ref<null | { clear: () => void }>(null);
const uploadedFiles = ref<File[]>([]);

// Константы для валидации
const MAX_FILE_SIZE: number = 1000000; // 1MB
const ALLOWED_FILE_TYPES: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const hobbyForm = reactive<Hobby>({
  title: '',
  description: '',
  type: '',
  equipment: [],
  photos: []
});

const hobbyTypes = ref<HobbyType[]>([
  { name: 'Музыка', value: 'music' },
  { name: 'Рыбалка', value: 'fishing' },
  { name: 'Спорт', value: 'sport' },
  { name: 'Искусство', value: 'art' },
  { name: 'Другое', value: 'other' }
]);

// Наблюдение за изменением видимости диалога
watch(() => props.visible, (visible: boolean) => {
  if (visible) {
    resetForm();
    if (fileUploadRef.value) {
      fileUploadRef.value.clear();
    }
    uploadedFiles.value = [];
  }
});

// Наблюдение за изменением текущего хобби
watch(() => props.hobby, (newHobby: Hobby | null) => {
  if (newHobby && props.visible) {
    resetForm();
  }
}, { deep: true });

const resetForm = (): void => {
  Object.keys(hobbyForm).forEach((key: keyof typeof hobbyForm) => {
    if (key === 'equipment') {
      hobbyForm[key] = Array.isArray(props.hobby?.[key])
          ? [...(props.hobby[key] as string[]) || []] // Безопасное приведение и обработка null
          : [];
    } else if (key === 'photos') {
      hobbyForm[key] = [] as string[]; // Явное указание типа
    } else if (key === 'title' || key === 'description' || key === 'type') {
      hobbyForm[key] = (props.hobby?.[key] as string) || ''; // Безопасное присваивание строки
    }
  });

  uploadedFiles.value = [];

  console.log('Форма сброшена:', { ...hobbyForm });
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const photoFiles: File[] = uploadedFiles.value;

    // Создаем копию данных для обновления
    const hobbyData: Partial<Hobby> = {
      title: hobbyForm.title,
      description: hobbyForm.description,
      type: hobbyForm.type,
      equipment: Array.isArray(hobbyForm.equipment) ? hobbyForm.equipment : []
    };

    console.log('Сохраняем хобби:', hobbyData);
    console.log('Фотографии:', photoFiles);

    if (props.hobby && props.hobby.id) {
      // Обновление существующего хобби
      await hobbiesStore.updateHobby(props.hobby.id, hobbyData, photoFiles);
      toast.add({ severity: 'success', summary: 'Успех', detail: 'Хобби обновлено', life: 3000 });
    } else {
      // Добавление нового хобби
      await hobbiesStore.addHobby({
        ...hobbyData,
        photos: []
      } as Hobby, photoFiles);
      toast.add({ severity: 'success', summary: 'Успех', detail: 'Хобби добавлено', life: 3000 });
    }

    emit('saved');
    closeDialog();
  } catch (error: unknown) {
    console.error('Ошибка при сохранении хобби:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: `Не удалось сохранить хобби: ${(error as Error)?.message || 'Неизвестная ошибка'}`,
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const validateForm = (): boolean => {
  if (!hobbyForm.title.trim()) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Введите название хобби', life: 3000 });
    return false;
  }
  if (!hobbyForm.description.trim()) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Введите описание хобби', life: 3000 });
    return false;
  }
  if (!hobbyForm.type) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Выберите тип хобби', life: 3000 });
    return false;
  }
  return true;
};

const onFileSelect = (event: FileUploadEvent | null): void => {
  if (!event || !event.files || !Array.isArray(event.files)) {
    console.error('Invalid event or files structure:', event);
    return;
  }

  // Проверка файлов перед добавлением
  const files: File[] = Array.from(event.files);
  const validFiles: File[] = files.filter(file => {
    // Проверка типа файла
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.add({
        severity: 'error',
        summary: 'Недопустимый формат',
        detail: `Файл "${file.name}" имеет недопустимый формат. Разрешены только изображения (JPEG, PNG, GIF, WEBP)`,
        life: 3000
      });
      return false;
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      toast.add({
        severity: 'error',
        summary: 'Превышен размер',
        detail: `Файл "${file.name}" превышает максимальный размер (1MB)`,
        life: 3000
      });
      return false;
    }

    return true;
  });

  // Добавляем новые файлы к существующим
  uploadedFiles.value = [...uploadedFiles.value, ...validFiles];

  // Очищаем компонент загрузки файлов
  if (fileUploadRef.value) {
    fileUploadRef.value.clear();
  }
};

const removeFile = (index: number): void => {
  uploadedFiles.value = uploadedFiles.value.filter((_, i) => i !== index);
};

const closeDialog = (): void => {
  emit('update:visible', false);
};

const onDialogHide = (): void => {
  if (!isLoading.value) {
    closeDialog();
  }
};
</script>

<template>
  <Dialog
      :visible="visible"
      :modal="true"
      :closable="!isLoading"
      :style="{ width: '550px' }"
      :header="props.hobby ? 'Редактировать хобби' : 'Добавить хобби'"
      @update:visible="onDialogHide"
  >
    <div v-if="isLoading" class="flex justify-content-center align-items-center" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); z-index: 1;">
      <ProgressSpinner />
    </div>

    <div class="p-fluid">
      <div class="field mb-4">
        <label for="title" class="font-bold">Название <span class="text-red-500">*</span></label>
        <InputText
            id="title"
            v-model="hobbyForm.title"
            :disabled="isLoading"
            aria-required="true"
        />
      </div>

      <div class="field mb-4">
        <label for="type" class="font-bold">Тип <span class="text-red-500">*</span></label>
        <Dropdown
            id="type"
            v-model="hobbyForm.type"
            :options="hobbyTypes"
            optionLabel="name"
            optionValue="value"
            placeholder="Выберите тип хобби"
            :disabled="isLoading"
            aria-required="true"
            class="w-full"
        />
      </div>

      <div class="field mb-4">
        <label for="description" class="font-bold">Описание <span class="text-red-500">*</span></label>
        <Textarea
            id="description"
            v-model="hobbyForm.description"
            rows="5"
            :disabled="isLoading"
            aria-required="true"
        />
      </div>

      <div class="field mb-4">
        <label for="equipment" class="font-bold">Оборудование</label>
        <Chips
            id="equipment"
            v-model="hobbyForm.equipment"
            :disabled="isLoading"
            placeholder="Добавьте элемент и нажмите Enter"
            aria-label="Список оборудования"
            separator=","
            class="w-full"
            @add="hobbyForm.equipment = [...hobbyForm.equipment]"
            @remove="hobbyForm.equipment = [...hobbyForm.equipment]"
        />
        <small class="text-gray-600">Введите название оборудования и нажмите Enter</small>
      </div>

      <div class="field mb-4">
        <label for="photos" class="font-bold">Фотографии</label>
        <FileUpload
            ref="fileUploadRef"
            id="photos"
            name="photos[]"
            :multiple="true"
            accept="image/*"
            :maxFileSize="MAX_FILE_SIZE"
            :disabled="isLoading"
            @select="onFileSelect"
            mode="basic"
            chooseLabel="Выбрать"
            class="mb-2"
        />

        <!-- Предпросмотр выбранных файлов -->
        <div v-if="uploadedFiles.length > 0" class="mt-2">
          <p class="font-bold">Выбранные файлы:</p>
          <ul class="list-none p-0 m-0">
            <li v-for="(file, index) in uploadedFiles" :key="index" class="flex align-items-center justify-content-between mb-2 p-2 border-1 border-round surface-border">
              <div class="flex align-items-center">
                <div class="w-3rem h-3rem mr-2 border-round bg-gray-100 flex align-items-center justify-content-center">
                  <i class="pi pi-image text-xl"></i>
                </div>
                <span>{{ file.name }}</span>
              </div>
              <button
                  type="button"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="removeFile(index)"
                  :disabled="isLoading"
              >
                <i class="pi pi-times"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <section class="flex justify-end gap-4 mt-4">
      <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          :disabled="isLoading"
          @click="closeDialog"
      />
      <Button
          label="Сохранить"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="isLoading"
          @click="handleSubmit"
      />
    </section>
  </Dialog>
</template>

<style scoped>
.field label {
  margin-bottom: 0.5rem;
  display: block;
}
</style>