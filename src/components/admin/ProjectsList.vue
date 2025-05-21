<script setup>
import { ref, computed } from 'vue';
import { formatDate, truncateDescription } from '../../utils/helpers';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
});

const emit = defineEmits(['edit', 'delete']);
const { t } = useI18n();

// Опции для фильтра языка
const languageOptions = [
  { label: t('admin.common.all'), value: 'all' },
  { label: t('admin.common.english'), value: 'en' },
  { label: t('admin.common.ukrainian'), value: 'uk' }
];

const selectedLanguage = ref('all');

// Фильтрация проектов по языку
const filteredProjects = computed(() => {
  if (selectedLanguage.value === 'all') {
    return props.projects;
  }
  return props.projects.filter(project => project.language === selectedLanguage.value);
});

</script>

<template>
  <!-- Фильтр по языку -->
  <div class="mb-4 flex items-center" v-if="!isLoading && projects.length">
    <label class="mr-2">{{ t('admin.projects.filterByLanguage') }}:</label>
    <Dropdown 
      v-model="selectedLanguage" 
      :options="languageOptions" 
      optionLabel="label" 
      optionValue="value"
      class="w-48"
    />
  </div>

  <div v-if="isLoading" class="flex justify-center my-8">
    <i class="pi pi-spin pi-spinner text-4xl"></i>
  </div>

  <div v-else-if="!projects.length" class="text-center my-8">
    <p class="text-gray-500">No projects found. Add your first project!</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card
        v-for="project in filteredProjects"
        :key="project.id"
        class="shadow-md hover:shadow-lg transition-shadow"
    >
      <template #header>
        <div class="relative h-48">
          <img
              :src="project.images?.[0]?.url || '/assets/placeholder.jpg'"
              :alt="project.title"
              class="w-full h-full object-cover"
              @error="$event.target.src='/assets/placeholder.jpg'"
          />
          <span
              v-if="project.category"
              class="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded"
          >
            {{ project.category }}
          </span>
        </div>
      </template>

      <template #title>
        <div class="flex items-center">
          <h3 class="text-xl">{{ project.title }}</h3>
          <span v-if="project.client" class="ml-2 text-sm text-gray-500">
            for {{ project.client }}
          </span>
        </div>
      </template>

      <template #subtitle>
        <p v-if="project.subtitle" class="text-sm text-gray-600">
          {{ project.subtitle }}
        </p>
      </template>

      <template #content>
        <p class="mb-2">{{ truncateDescription(project.description) }}</p>

        <div v-if="project.technologies" class="mb-2">
          <span
              v-for="(tech, index) in (Array.isArray(project.technologies)
              ? project.technologies
              : project.technologies.split(','))"
              :key="index"
              class="inline-block bg-gray-100 text-xs px-2 py-1 rounded mr-1 mb-1"
          >
            {{ tech.trim() }}
          </span>
        </div>

        <div class="flex gap-2 mb-2">
          <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              class="text-xs text-blue-600 hover:underline"
          >
            <i class="pi pi-external-link mr-1"></i>Live Demo
          </a>
          <a
              v-if="project.sourceUrl"
              :href="project.sourceUrl"
              target="_blank"
              class="text-xs text-blue-600 hover:underline"
          >
            <i class="pi pi-github mr-1"></i>Source Code
          </a>
        </div>

        <small class="text-gray-500 block">
          Created: {{ formatDate(project.createdAt) }}
        </small>

        <Divider />

        <div class="flex justify-end gap-2">
          <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-sm"
              @click="$emit('edit', project)"
          />
          <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-sm p-button-danger"
              @click="$emit('delete', project)"
          />
        </div>
      </template>
    </Card>
  </div>
</template>