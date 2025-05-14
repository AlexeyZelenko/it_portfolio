<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useExperiencesStore } from '../../stores/experiences';
import { useToast } from 'primevue/usetoast';
import DialogFooter from './DialogFooter.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Chips from 'primevue/chips';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';

const props = defineProps({
  visible: Boolean,
  experience: Object
});

const emit = defineEmits(['update:visible', 'saved']);

const experiencesStore = useExperiencesStore();
const toast = useToast();
const isLoading = ref(false);

const languages = [
  { name: 'English', value: 'en' },
  { name: 'Ukrainian', value: 'uk' },
];

const experienceForm = reactive({
  company: '',
  position: '',
  period: '',
  location: '',
  description: '',
  achievements: [],
  technologies: [],
  projects: [], // Змінено на масив об'єктів
  responsibilities: [],
  language: '',
});

const currentProjectIndex = ref(-1);
const projectDialogVisible = ref(false);
const projectForm = reactive({
  name: '',
  description: '',
  technologies: [],
  impact: '',
  language: ''
});

const isValid = computed(() => {
  return experienceForm.company &&
      experienceForm.position &&
      experienceForm.period &&
      experienceForm.language &&
      experienceForm.location &&
      experienceForm.description;
});

watch(() => props.visible, (visible) => {
  if (visible) resetForm();
});

const resetForm = () => {
  if (props.experience) {
    Object.keys(experienceForm).forEach(key => {
      experienceForm[key] = props.experience[key] || (Array.isArray(props.experience[key]) ? [] : '');
    });
  } else {
    Object.keys(experienceForm).forEach(key => {
      experienceForm[key] = Array.isArray(experienceForm[key]) ? [] : '';
    });
  }
};

const saveExperience = async () => {
  isLoading.value = true;
  try {
    if (props.experience) {
      await experiencesStore.updateExperience(props.experience.id, experienceForm);
      showSuccess('Experience updated successfully');
    } else {
      await experiencesStore.addExperience(experienceForm);
      showSuccess('Experience added successfully');
    }
    closeDialog();
    emit('saved');
  } catch (error) {
    showError(error.message || 'Failed to save experience');
  } finally {
    isLoading.value = false;
  }
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

// Функції для роботи з проєктами
const openProjectDialog = (index = -1) => {
  currentProjectIndex.value = index;
  if (index >= 0 && experienceForm.projects[index]) {
    Object.assign(projectForm, experienceForm.projects[index]);
  } else {
    Object.assign(projectForm, { name: '', description: '', technologies: [], impact: '', language: '' });
  }
  projectDialogVisible.value = true;
};

const saveProject = () => {
  if (currentProjectIndex.value >= 0) {
    experienceForm.projects[currentProjectIndex.value] = { ...projectForm };
  } else {
    experienceForm.projects.push({ ...projectForm });
  }
  projectDialogVisible.value = false;
};

const deleteProject = (index) => {
  experienceForm.projects.splice(index, 1);
};

const closeProjectDialog = () => {
  projectDialogVisible.value = false;
};
</script>

<template>
  <Dialog
      :visible="visible"
      :header="experience ? 'Edit Experience' : 'Add New Experience'"
      modal
      class="w-full max-w-2xl"
      @update:visible="closeDialog"
  >
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="company" class="block mb-2 font-medium">Company*</label>
          <InputText
              id="company"
              v-model="experienceForm.company"
              class="w-full"
              required
          />
        </div>

        <div class="field">
          <label for="position" class="block mb-2 font-medium">Position*</label>
          <InputText
              id="position"
              v-model="experienceForm.position"
              class="w-full"
              required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="period" class="block mb-2 font-medium">Period*</label>
          <InputText
              id="period"
              v-model="experienceForm.period"
              class="w-full"
              required
          />
        </div>

        <div class="field">
          <label for="location" class="block mb-2 font-medium">Location*</label>
          <InputText
              id="location"
              v-model="experienceForm.location"
              class="w-full"
              required
          />
        </div>
      </div>

      <div class="field">
        <label for="description" class="block mb-2 font-medium">Description*</label>
        <Textarea
            id="description"
            v-model="experienceForm.description"
            rows="5"
            class="w-full"
            required
        />
      </div>

      <div class="field">
        <label for="achievements" class="block mb-2 font-medium">Achievements</label>
        <Chips
            v-model="experienceForm.achievements"
            class="w-full"
            placeholder="Add achievement and press enter"
        />
      </div>

      <div class="field">
        <label for="technologies" class="block mb-2 font-medium">Technologies</label>
        <Chips
            v-model="experienceForm.technologies"
            class="w-full"
            placeholder="Add technology and press enter"
        />
      </div>

      <div class="field">
        <label for="responsibilities" class="block mb-2 font-medium">Responsibilities</label>
        <Chips
            v-model="experienceForm.responsibilities"
            class="w-full"
            placeholder="Add responsibility and press enter"
        />
      </div>

      <div class="field">
        <label for="language" class="block mb-2 font-medium">Language*</label>
        <SelectButton
            v-model="experienceForm.language"
            :options="languages"
            optionLabel="name"
            class="w-full"
            required
        />
      </div>

      <div>
        <label class="block mb-2 font-medium">Projects</label>
        <div v-for="(project, index) in experienceForm.projects" :key="index" class="flex items-center mb-2">
          <span>{{ project.name || 'New Project' }} ({{ project.language.name || 'Not specified' }})</span>
          <Button icon="pi pi-pencil" class="p-button-sm ml-2" @click="openProjectDialog(index)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-danger ml-2" @click="deleteProject(index)" />
        </div>
        <Button label="Add Project" class="mt-2" @click="openProjectDialog()" />
      </div>
    </div>

    <DialogFooter
        :is-loading="isLoading"
        :is-valid="isValid"
        @cancel="closeDialog"
        @save="saveExperience"
    />
  </Dialog>

  <Dialog
      v-model:visible="projectDialogVisible"
      header="Project Details"
      modal
      class="w-full max-w-xl"
  >
    <div class="space-y-4">
      <div class="field">
        <label for="projectName" class="block mb-2 font-medium">Project Name</label>
        <InputText id="projectName" v-model="projectForm.name" class="w-full" />
      </div>
      <div class="field">
        <label for="projectDescription" class="block mb-2 font-medium">Description</label>
        <Textarea id="projectDescription" v-model="projectForm.description" rows="3" class="w-full" />
      </div>
      <div class="field">
        <label for="projectTechnologies" class="block mb-2 font-medium">Technologies</label>
        <Chips v-model="projectForm.technologies" class="w-full" placeholder="Add technology and press enter" />
      </div>
      <div class="field">
        <label for="projectImpact" class="block mb-2 font-medium">Impact</label>
        <InputText id="projectImpact" v-model="projectForm.impact" class="w-full" />
      </div>
      <div class="field">
        <label for="projectLanguage" class="block mb-2 font-medium">Language</label>
        <SelectButton
            id="projectLanguage"
            v-model="projectForm.language"
            :options="languages"
            optionLabel="name"
            optionValue="value"
            class="w-full"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" @click="closeProjectDialog" class="p-button-secondary" />
      <Button label="Save" @click="saveProject" />
    </template>
  </Dialog>
</template>

<style scoped>
/* Кастомні стилі для SelectButton (якщо потрібно додаткове налаштування) */
.p-selectbutton.p-buttonset .p-button.p-highlight {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.p-selectbutton.p-buttonset .p-button:not(.p-highlight):hover {
  background-color: #e9ecef;
  color: #495057;
  border-color: #ced4da;
}

.dark .p-selectbutton.p-buttonset .p-button.p-highlight {
  background-color: #3b82f6;
  color: #f8f9fa;
  border-color: #3b82f6;
}

.dark .p-selectbutton.p-buttonset .p-button:not(.p-highlight):hover {
  background-color: #343a40;
  color: #f8f9fa;
  border-color: #495057;
}
</style>