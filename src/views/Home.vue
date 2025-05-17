<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '../stores/projects';
import { storeToRefs } from 'pinia';

// Типы для данных проекта
interface ProjectImage {
  url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  subtitle: string;
  language: string;
  images?: ProjectImage[];
}

// Конфигурация для информационных карточек
const statsCards = [
  {
    icon: 'pi pi-calendar',
    value: '5+',
    colorClass: 'primary',
    translationKey: 'home.about.experience',
    delay: 100
  },
  {
    icon: 'pi pi-check-circle',
    value: '20+',
    colorClass: 'secondary',
    translationKey: 'home.about.projects',
    delay: 200
  },
  {
    icon: 'pi pi-users',
    value: '1000+',
    colorClass: 'accent',
    translationKey: 'home.about.clients',
    delay: 300
  }
];

// Константа для заглушки изображения
const FALLBACK_IMAGE = 'https://images.pexels.com/photos/7000/pexels-photo-7000.jpeg?auto=compress&cs=tinysrgb&w=800';

const { t, locale } = useI18n();
const router = useRouter();
const projectsStore = useProjectsStore();
const { projects } = storeToRefs(projectsStore);
const loading = ref<boolean>(true);

// Навигация по приложению
const navigateTo = (path: string, event?: Event) => {
  if (event) {
    event.stopPropagation();
  }
  router.push(path);
};

// Получаем только первые 3 проекта для отображения на главной,
// соответствующие текущему языку
const featuredProjects = computed<Project[]>(() => {
  return projects.value
    .filter((project) => project.language === locale.value)
    .slice(0, 3);
});

// Расчет количества заглушек
const placeholdersCount = computed(() => Math.max(0, 3 - featuredProjects.value.length));

// Получить технологии как массив
const getTechnologies = (techString: string): string[] => {
  return techString?.split(',').map(tech => tech.trim()) || [];
};

// Получить URL изображения с фолбэком
const getImageUrl = (project: Project): string => {
  return project.images && project.images.length > 0 
    ? project.images[0].url 
    : FALLBACK_IMAGE;
};

onMounted(async () => {
  try {
    await projectsStore.fetchProjects();
  } catch (error) {
    console.error('Ошибка при загрузке проектов:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <!-- Главный баннер -->
    <section class="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-32">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Текстовая информация -->
          <div data-aos="fade-right">
            <p class="text-primary-600 dark:text-primary-400 font-medium mb-2">
              {{ t('home.greeting') }}
            </p>
            <h1 class="text-4xl md:text-6xl font-bold mb-4">
              {{ t('home.name') }}
            </h1>
            <h2 class="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
              {{ t('home.title') }}
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              {{ t('home.subtitle') }}
            </p>
            <div class="flex flex-wrap gap-4">
              <Button
                :label="t('home.cta')"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-primary p-button-lg"
                @click="navigateTo('/projects')"
              />
              <Button
                :label="t('nav.contact')"
                icon="pi pi-envelope"
                iconPos="right"
                class="p-button-outlined p-button-lg"
                @click="navigateTo('/contact')"
              />
            </div>
          </div>

          <!-- Аватар с анимированными кругами -->
          <div class="hidden lg:flex justify-center" data-aos="fade-left">
            <div class="relative w-80 h-80">
              <div 
                v-for="(_, i) in 3" 
                :key="`circle-${i}`" 
                class="absolute w-full h-full bg-gradient-to-tr rounded-full animate-float" 
                :class="`from-primary-${500 + (i * 100)} to-secondary-${500 + (i * 100)} opacity-${30 - (i * 10)}`"
                :style="`animation-delay: ${i * 0.5}s`"
              ></div>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/it-portfolio-specialist.firebasestorage.app/o/avatar%2Favatar_edit_2.webp?alt=media&token=b82c52c4-2d05-4f9a-ad10-8921c2b9851a"
                alt="Developer Portrait"
                class="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SVG волна для разделения секций -->
      <div class="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fill-opacity="1" class="text-white dark:text-gray-800" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>

    <!-- Секция "Обо мне" с карточками -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.about.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            {{ t('home.about.content') }}
          </p>
        </div>

        <!-- Статистика с использованием компонента -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card 
            v-for="(card, index) in statsCards" 
            :key="`stat-${index}`" 
            class="text-center" 
            data-aos="fade-up" 
            :data-aos-delay="card.delay"
          >
            <template #header>
              <div class="flex justify-center pt-6">
                <div class="w-16 h-16 flex items-center justify-center rounded-full"
                  :class="`bg-${card.colorClass}-100 dark:bg-${card.colorClass}-900 text-${card.colorClass}-600 dark:text-${card.colorClass}-400`"
                >
                  <i :class="`${card.icon} text-3xl`"></i>
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-4xl font-bold">{{ card.value }}</h3>
            </template>
            <template #content>
              <p class="text-gray-600 dark:text-gray-400">{{ t(card.translationKey) }}</p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Избранные проекты -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('projects.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            {{ t('projects.subtitle') }}
          </p>
        </div>

        <!-- Индикатор загрузки -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
        </div>

        <!-- Карточки проектов -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Проекты из хранилища -->
          <div
            v-for="(project, index) in featuredProjects"
            :key="`project-${project.id}`"
            class="card group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
            @click="navigateTo(`/projects/${project.id}`)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="getImageUrl(project)"
                :alt="project.title"
                class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <Button
                  :label="t('projects.viewMore')"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  class="p-button-sm"
                  @click="navigateTo(`/projects/${project.id}`, $event)"
                />
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ project.subtitle }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tech, techIndex) in getTechnologies(project.technologies)"
                  :key="`tech-${project.id}-${techIndex}`"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

          <!-- Плейсхолдеры для карточек, если проектов меньше 3 -->
          <div
            v-for="i in placeholdersCount"
            :key="`placeholder-${i}`"
            class="card group animate-pulse"
            data-aos="fade-up"
            :data-aos-delay="featuredProjects.length * 100 + i * 100"
          >
            <div class="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-56"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-full"></div>
              <div class="flex flex-wrap gap-2">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка "Посмотреть все проекты" -->
        <div class="flex justify-center mt-12" data-aos="fade-up">
          <Button
            :label="t('projects.viewAll')"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="p-button-outlined"
            @click="navigateTo('/projects')"
          />
        </div>
      </div>
    </section>
  </div>
</template>