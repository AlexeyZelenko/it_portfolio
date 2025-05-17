<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import { useProjectsStore } from '../stores/projects';
import { storeToRefs } from 'pinia';

// Переносим типы в отдельный файл или определяем здесь
interface ProjectImage {
  url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string;
  images: ProjectImage[];
  subtitle: string;
  language?: string;
}

// Используем enum для категорий
type ProjectCategory = 'Web' | 'Mobile' | 'UI/UX';

// Получаем хранилище и его реактивные свойства
const projectsStore = useProjectsStore();
const { projects } = storeToRefs(projectsStore);

const { t, locale } = useI18n();
const router = useRouter();

// Константы для фильтров
const FILTER_ALL = 'All';
const filters = ref<string[]>([FILTER_ALL, 'Web', 'Mobile', 'UI/UX']);
const selectedFilter = ref<string>(FILTER_ALL);

// Оптимизированный расчет фильтрованных проектов
const filteredProjects = computed<Project[]>(() => {
  return projects.value
      .filter((project) => {
        // Фильтр по языку
        if (project.language) {
          return project.language.includes(locale.value);
        }
        return true;
      })
      .filter((project) => {
        // Фильтр по категории
        return selectedFilter.value === FILTER_ALL || project.category === selectedFilter.value;
      });
});

// Вспомогательная функция для отображения технологий
const formatTechnologies = (techString: string) => {
  const techArray = techString.split(',');
  const displayedTechs = techArray.slice(0, 3);
  const remaining = techArray.length > 3 ? techArray.length - 3 : 0;

  return {
    displayed: displayedTechs,
    remaining
  };
};

// Навигация к проекту
const navigateToProject = (projectId: number, event?: Event) => {
  if (event) {
    event.stopPropagation();
  }
  router.push(`/projects/${projectId}`);
};

onMounted(async () => {
  await projectsStore.fetchProjects();
});
</script>

<template>
  <div>
    <!-- Заголовок и фильтры -->
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

    <!-- Сетка проектов -->
    <section class="section">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
              v-for="(project, index) in filteredProjects"
              :key="project.id"
              class="card group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
              @click="navigateToProject(project.id)"
          >
            <!-- Изображение проекта с наложением -->
            <div class="relative overflow-hidden">
              <img
                  v-if="project.images?.length"
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
                    @click="navigateToProject(project.id, $event)"
                />
              </div>
            </div>

            <!-- Информация о проекте -->
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

              <!-- Технологии с оптимизированным отображением -->
              <div class="flex flex-wrap gap-2">
                <template v-if="project.technologies">
                  <span
                      v-for="tech in formatTechnologies(project.technologies).displayed"
                      :key="tech"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {{ tech.trim() }}
                  </span>
                  <span
                      v-if="formatTechnologies(project.technologies).remaining > 0"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    +{{ formatTechnologies(project.technologies).remaining }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>