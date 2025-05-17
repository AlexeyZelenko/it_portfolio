<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from 'primevue/progressbar'
import { useTechnologiesStore } from '../stores/technologies'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const technologiesStore = useTechnologiesStore()
const { technologies } = storeToRefs(technologiesStore)

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
    frontend: technologies.value.filter(tech => tech.category === 'frontend'),
    backend: technologies.value.filter(tech => tech.category === 'backend'),
    mobile: technologies.value.filter(tech => tech.category === 'mobile'),
    other: technologies.value.filter(tech => tech.category === 'other')
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
  await technologiesStore.fetchTechnologies()
})
</script>

<template>
  <div v-if="technologies?.length">
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