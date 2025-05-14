<script setup>
import { ref, reactive, watch } from 'vue';
import { useProjectsStore } from '../../stores/projects';
import { useToast } from 'primevue/usetoast';
import { storage } from '../../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProjectFormFields from './ProjectFormFields.vue';
import ProjectImagesUpload from './ProjectImagesUpload.vue';
import DialogFooter from './DialogFooter.vue';
import Dialog from 'primevue/dialog';

const props = defineProps({
  visible: Boolean,
  project: Object
});

const emit = defineEmits(['update:visible', 'saved']);

const projectsStore = useProjectsStore();
const toast = useToast();
const isLoading = ref(false);

const projectForm = reactive({
  title: '',
  description: '',
  category: '',
  technologies: '',
  liveUrl: '',
  sourceUrl: '',
  subtitle: '',
  client: '',
  date: '',
  imagesWithDescriptions: [],
  language: ''
});

watch(() => props.visible, (visible) => {
  if (visible) resetForm();
});

const resetForm = () => {
  Object.keys(projectForm).forEach(key => {
    projectForm[key] = props.project?.[key] || '';
  });

  projectForm.technologies = Array.isArray(props.project?.technologies)
    ? props.project.technologies.join(', ')
    : props.project?.technologies || ''; // Додано || ''

  projectForm.imagesWithDescriptions = props.project?.images?.map(img => ({
    file: null,
    description: img.description || '',
    url: img.url,
    isExisting: true
  })) || []; // Забезпечуємо порожній масив, якщо props.project.images відсутній

  if (!projectForm.imagesWithDescriptions.length) {
    addImageField();
  }
};

const addImageField = () => {
  projectForm.imagesWithDescriptions.push({ file: null, description: '' });
};

const saveProject = async () => {
  isLoading.value = true;

  try {
    const projectData = { ...projectForm };
    delete projectData.imagesWithDescriptions; // Удаляем временное поле с файлами

    const uploadedImages = await uploadNewImages();
    const finalImages = [
      ...projectForm.imagesWithDescriptions.filter(img => img.isExisting),
      ...uploadedImages
    ];

    if (props.project) {
      await projectsStore.updateProject(props.project.id, projectData, finalImages);
      showSuccess('Project updated successfully');
    } else {
      await projectsStore.addProject(projectData, projectForm.imagesWithDescriptions);
      showSuccess('Project added successfully');
    }

    closeDialog();
    emit('saved');
  } catch (error) {
    showError(error.message || 'Failed to save project');
  } finally {
    isLoading.value = false;
  }
};

const prepareProjectData = async () => {
  const projectData = { ...projectForm };

  projectData.technologies = projectData.technologies
      ? projectData.technologies.split(',').map(tech => tech.trim())
      : [];

  const uploadedImages = await uploadNewImages();
  projectData.images = [
    ...projectForm.imagesWithDescriptions.filter(img => img.isExisting),
    ...uploadedImages
  ];

  return projectData;
};

const uploadNewImages = async () => {
  const imagesToUpload = projectForm.imagesWithDescriptions
      .filter(item => item.file)
      .map(async (imageWithDescription) => {
        const fileRef = storageRef(storage, `projects/${imageWithDescription.file.name}_${Date.now()}`);
        // Используйте uploadBytes вместо fileRef.put
        await uploadBytes(fileRef, imageWithDescription.file);
        const url = await getDownloadURL(fileRef);
        return {
          url,
          description: imageWithDescription.description
        };
      });

  return await Promise.all(imagesToUpload);
};

const showSuccess = (message) => {
  toast.add({ severity: 'success', detail: message, life: 3000 });
};

const showError = (message) => {
  toast.add({ severity: 'error', detail: message, life: 3000 });
};

const closeDialog = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Dialog
      :visible="visible"
      header="project ? 'Edit Project' : 'Add New Project'"
      modal="true"
      class="w-full max-w-2xl gap-4"
      @update:visible="closeDialog"
  >
    <ProjectFormFields
        v-model:form="projectForm"
    />

    <ProjectImagesUpload
        v-model:images="projectForm.imagesWithDescriptions"
        @add-image="addImageField"
    />

    <DialogFooter        
        :is-loading="isLoading"
        :is-valid="!!projectForm.title && !!projectForm.description"
        @cancel="closeDialog"
        @save="saveProject"
    />
  </Dialog>
</template>