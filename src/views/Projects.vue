<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import { useProjectsStore } from '../stores/projects';

// Определяем типы для проекта и хранилища
interface ProjectImage {
  url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: 'Web' | 'Mobile' | 'UI/UX';
  technologies: string;
  images: ProjectImage[];
  subtitle: string
}

interface ProjectsStore {
  projects: Project[];
  fetchProjects: () => Promise<void>;
}

const { t } = useI18n();
const router = useRouter();

//@ts-ignore
const projectsStore = useProjectsStore() as ProjectsStore; // Явное приведение типа к нашему интерфейсу хранилища
const projects = computed<Project[]>(() => projectsStore.projects);

const filters = ref<string[]>(['All', 'Web', 'Mobile', 'UI/UX']);
const selectedFilter = ref<string>('All');

const filteredProjects = computed<Project[]>(() => {
  if (selectedFilter.value === 'All') {
    return projects.value;
  }
  return projects.value.filter((project) => project.category === selectedFilter.value);
});

onMounted(async () => {
  await projectsStore.fetchProjects();
});
</script>

<template>
  <div>
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
          {{ t('projects.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
          {{ t('projects.subtitle') }}
        </p>

        <div class="flex justify-center items-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="200">
          <Button
              v-for="filter in filters"
              :key="filter"
              :label="filter"
              :class="[
              'p-button-rounded',
              selectedFilter === filter ? 'p-button-primary' : 'p-button-outlined'
            ]"
              @click="selectedFilter = filter"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
              v-for="(project, index) in filteredProjects"
              :key="project.id"
              class="card group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
              @click="router.push(`/projects/${project.id}`)"
          >
            <div class="relative overflow-hidden">
              <img
                  :src="project.images[0].url"
                  :alt="project.title"
                  class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <Button
                    :label="t('projects.viewMore')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="p-button-sm"
                    @click="router.push(`/projects/${project.id}`)"
                />
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-semibold">{{ project.title }}</h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                  {{ project.category }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ project.subtitle }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                    v-for="tech in project.technologies.split(',').slice(0, 3)"
                    :key="tech"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {{ tech }}
                </span>
                <span
                    v-if="project.technologies.length > 3"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  +{{ project.technologies.split(',').length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>