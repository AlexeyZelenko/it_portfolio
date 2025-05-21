<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from 'primevue/progressbar'
import { useTechnologiesStore } from '../stores/technologies'
import { useProjectsStore } from '../stores/projects'
import { storeToRefs } from 'pinia'
import type { Technology } from '../stores/technologies'

const { t } = useI18n()
const technologiesStore = useTechnologiesStore()
const projectsStore = useProjectsStore()
const { technologies } = storeToRefs(technologiesStore)
const { projects } = storeToRefs(projectsStore)

// Объединенный список технологий с уникальными элементами
const combinedTechnologies = computed(() => {
  // Получаем технологии из хранилища технологий
  const techList = [...technologies.value]
  
  // Получаем технологии из проектов
  const projectTechs: Technology[] = []
  
  // Обрабатываем технологии из каждого проекта
  projects.value.forEach(project => {
    if (project.technologies) {
      // Разделяем строку технологий на массив
      const techNames = project.technologies.split(',').map(t => t.trim())
      
      // Создаем объекты технологий из имен
      techNames.forEach(techName => {
        // Определяем категорию по умолчанию (можно улучшить логику определения категории)
        let category: 'frontend' | 'backend' | 'mobile' | 'other' = 'other'
        
        // Простая логика определения категории по имени технологии
        if (['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(techName)) {
          category = 'frontend'
        } else if (['Node.js', 'Express', 'Django', 'Flask', 'PHP', 'Laravel', 'Spring'].includes(techName)) {
          category = 'backend'
        } else if (['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS'].includes(techName)) {
          category = 'mobile'
        }
        
        projectTechs.push({
          name: techName,
          category: category,
          proficiency: 70, // Устанавливаем средний уровень владения по умолчанию
          icon: 'pi pi-code' // Иконка по умолчанию
        })
      })
    }
  })
  
  // Объединяем списки технологий
  const allTechs = [...techList, ...projectTechs]
  
  // Создаем Map для хранения уникальных технологий по имени
  const uniqueTechMap = new Map()
  
  // Заполняем Map, отдавая приоритет технологиям из хранилища технологий
  allTechs.forEach(tech => {
    if (!uniqueTechMap.has(tech.name)) {
      uniqueTechMap.set(tech.name, tech)
    }
  })
  
  // Преобразуем Map обратно в массив
  return Array.from(uniqueTechMap.values())
})

// Константа для уровней владения - лучше переиспользовать
const PROFICIENCY_LEVELS = {
  EXPERT: 90,
  ADVANCED: 80,
  INTERMEDIATE: 70
}

const getProficiencyLevel = (proficiency: number) => {
  if (proficiency >= PROFICIENCY_LEVELS.EXPERT) return t('technologies.levels.expert')
  if (proficiency >= PROFICIENCY_LEVELS.ADVANCED) return t('technologies.levels.advanced')
  if (proficiency >= PROFICIENCY_LEVELS.INTERMEDIATE) return t('technologies.levels.intermediate')
  return t('technologies.levels.beginner')
}

// Вычисляемые свойства для фильтрации технологий
const techByCategory = computed(() => {
  const categories = {
    frontend: combinedTechnologies.value.filter(tech => tech.category === 'frontend'),
    backend: combinedTechnologies.value.filter(tech => tech.category === 'backend'),
    mobile: combinedTechnologies.value.filter(tech => tech.category === 'mobile'),
    other: combinedTechnologies.value.filter(tech => tech.category === 'other')
  }
  return categories
})

// Данные для категорий - упрощает переиспользование в шаблоне
const categoryConfig = {
  frontend: { 
    icon: 'pi pi-desktop', 
    colorClass: 'primary',
    translationKey: 'technologies.frontend'
  },
  backend: { 
    icon: 'pi pi-server', 
    colorClass: 'secondary',
    translationKey: 'technologies.backend'
  },
  mobile: { 
    icon: 'pi pi-mobile', 
    colorClass: 'accent',
    translationKey: 'technologies.mobile'
  },
  other: { 
    icon: 'pi pi-cog', 
    colorClass: 'gray',
    translationKey: 'technologies.other'
  }
}

onMounted(async () => {
  await Promise.all([
    technologiesStore.fetchTechnologies(),
    projectsStore.fetchProjects()
  ])
})
</script>

<template>
  <div v-if="combinedTechnologies?.length">
    <!-- Technologies Header -->
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
          {{ t('technologies.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ t('technologies.subtitle') }}
        </p>
      </div>
    </section>
    
    <!-- Technology Categories -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <!-- Шаблон для каждой категории с переиспользованием кода -->
        <template v-for="(category, categoryName) in techByCategory" :key="categoryName">
          <div class="mb-16" data-aos="fade-up" v-if="category.length">
            <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
              <i :class="[categoryConfig[categoryName].icon, `text-${categoryConfig[categoryName].colorClass}-600 dark:text-${categoryConfig[categoryName].colorClass}-400 mr-3`]"></i>
              {{ t(categoryConfig[categoryName].translationKey) }}
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                v-for="(tech, index) in category" 
                :key="tech.id"
                class="card p-6"
                data-aos="fade-up"
                :data-aos-delay="index * 50"
              >
                <div class="flex items-center mb-4">
                  <div 
                    class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    :class="`bg-${categoryConfig[categoryName].colorClass}-100 dark:bg-${categoryConfig[categoryName].colorClass}-900 text-${categoryConfig[categoryName].colorClass}-600 dark:text-${categoryConfig[categoryName].colorClass}-400`"
                  >
                    <i :class="[tech.icon, 'text-xl']"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ getProficiencyLevel(tech.proficiency) }}
                    </p>
                  </div>
                </div>
                <ProgressBar :value="tech.proficiency" :style="{ height: '20px' }" />
                <p v-if="tech.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ tech.description }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>