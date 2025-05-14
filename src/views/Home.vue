<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects'

const { t } = useI18n()
const router = useRouter()
const projectsStore = useProjectsStore()
const loading = ref(true)

// Получаем проекты и берем только первые 3 для отображения на главной
const featuredProjects = computed(() => {
  return projectsStore.projects.slice(0, 3)
})

onMounted(async () => {
  try {
    await projectsStore.fetchProjects()
  } catch (error) {
    console.error('Ошибка при загрузке проектов:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-32">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                @click="router.push('/projects')"
              />
              <Button 
                :label="t('nav.contact')" 
                icon="pi pi-envelope" 
                iconPos="right" 
                class="p-button-outlined p-button-lg" 
                @click="router.push('/contact')"
              />
            </div>
          </div>
          
          <div class="hidden lg:flex justify-center" data-aos="fade-left">
            <div class="relative w-80 h-80">
              <div class="absolute w-full h-full bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full opacity-30 animate-float" style="animation-delay: 0s;"></div>
              <div class="absolute w-full h-full bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-full opacity-20 animate-float" style="animation-delay: 0.5s;"></div>
              <div class="absolute w-full h-full bg-gradient-to-tr from-primary-700 to-secondary-700 rounded-full opacity-10 animate-float" style="animation-delay: 1s;"></div>
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Developer Portrait" 
                class="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wave Divider -->
      <div class="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fill-opacity="1" class="text-white dark:text-gray-800" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
    
    <!-- About Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.about.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            {{ t('home.about.content') }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card class="text-center" data-aos="fade-up" data-aos-delay="100">
            <template #header>
              <div class="flex justify-center pt-6">
                <div class="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
                  <i class="pi pi-calendar text-3xl"></i>
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-4xl font-bold">5+</h3>
            </template>
            <template #content>
              <p class="text-gray-600 dark:text-gray-400">{{ t('home.about.experience') }}</p>
            </template>
          </Card>
          
          <Card class="text-center" data-aos="fade-up" data-aos-delay="200">
            <template #header>
              <div class="flex justify-center pt-6">
                <div class="w-16 h-16 flex items-center justify-center bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 rounded-full">
                  <i class="pi pi-check-circle text-3xl"></i>
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-4xl font-bold">50+</h3>
            </template>
            <template #content>
              <p class="text-gray-600 dark:text-gray-400">{{ t('home.about.projects') }}</p>
            </template>
          </Card>
          
          <Card class="text-center" data-aos="fade-up" data-aos-delay="300">
            <template #header>
              <div class="flex justify-center pt-6">
                <div class="w-16 h-16 flex items-center justify-center bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400 rounded-full">
                  <i class="pi pi-users text-3xl"></i>
                </div>
              </div>
            </template>
            <template #title>
              <h3 class="text-4xl font-bold">30+</h3>
            </template>
            <template #content>
              <p class="text-gray-600 dark:text-gray-400">{{ t('home.about.clients') }}</p>
            </template>
          </Card>
        </div>
      </div>
    </section>
    
    <!-- Featured Projects Section -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <div class="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('projects.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            {{ t('projects.subtitle') }}
          </p>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-12">
          <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="project in featuredProjects" 
            :key="project.id" 
            class="card group cursor-pointer"
            data-aos="fade-up"
            :data-aos-delay="100"
            @click="router.push(`/projects/${project.id}`)"
          >
            <div class="relative overflow-hidden">
              <img 
                :src="project.images && project.images.length > 0 ? project.images[0].url : 'https://images.pexels.com/photos/7000/pexels-photo-7000.jpeg?auto=compress&cs=tinysrgb&w=800'" 
                :alt="project.title" 
                class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <Button 
                  :label="t('projects.viewMore')" 
                  icon="pi pi-arrow-right" 
                  iconPos="right" 
                  class="p-button-sm"
                />
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tech in project.technologies.split(', ')" 
                  :key="tech"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Показываем заглушки, если проектов меньше 3 -->
          <div 
            v-if="featuredProjects.length < 3"
            v-for="i in 2" 
            :key="`placeholder-${i}`" 
            class="card group"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
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
        
        <div class="flex justify-center mt-12" data-aos="fade-up">
          <Button 
            :label="t('projects.title')" 
            icon="pi pi-arrow-right" 
            iconPos="right" 
            class="p-button-outlined" 
            @click="router.push('/projects')"
          />
        </div>
      </div>
    </section>
  </div>
</template>