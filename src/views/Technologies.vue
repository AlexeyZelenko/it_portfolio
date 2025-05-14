<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from 'primevue/progressbar'
import { useTechnologiesStore } from '../stores/technologies'

const { t } = useI18n()
const technologiesStore = useTechnologiesStore()

const getProficiencyLevel = (proficiency: number) => {
  if (proficiency >= 90) return 'Expert'
  if (proficiency >= 80) return 'Advanced'
  if (proficiency >= 70) return 'Intermediate'
  return 'Beginner'
}

onMounted(async () => {
  await technologiesStore.fetchTechnologies()
})

const frontendTech = computed(() => 
  technologiesStore.technologies.filter(tech => tech.category === 'frontend')
)

const backendTech = computed(() => 
  technologiesStore.technologies.filter(tech => tech.category === 'backend')
)

const mobileTech = computed(() => 
  technologiesStore.technologies.filter(tech => tech.category === 'mobile')
)

const otherTech = computed(() => 
  technologiesStore.technologies.filter(tech => tech.category === 'other')
)
</script>

<template>
  <div v-if="technologiesStore.technologies">
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
        <!-- Frontend Technologies -->
        <div class="mb-16" data-aos="fade-up" v-if="frontendTech.length">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
            <i class="pi pi-desktop text-primary-600 dark:text-primary-400 mr-3"></i>
            {{ t('technologies.frontend') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(tech, index) in frontendTech" 
              :key="tech.id"
              class="card p-6"
              data-aos="fade-up"
              :data-aos-delay="index * 50"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                  <i :class="[tech.icon, 'text-xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ getProficiencyLevel(tech.proficiency) }}
                  </p>
                </div>
              </div>
              <ProgressBar :value="tech.proficiency" :style="{ height: '8px' }" />
              <p v-if="tech.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Backend Technologies -->
        <div class="mb-16" data-aos="fade-up" v-if="backendTech.length">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
            <i class="pi pi-server text-secondary-600 dark:text-secondary-400 mr-3"></i>
            {{ t('technologies.backend') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(tech, index) in backendTech" 
              :key="tech.id"
              class="card p-6"
              data-aos="fade-up"
              :data-aos-delay="index * 50"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-4">
                  <i :class="[tech.icon, 'text-xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ getProficiencyLevel(tech.proficiency) }}
                  </p>
                </div>
              </div>
              <ProgressBar :value="tech.proficiency" :style="{ height: '8px' }" />
              <p v-if="tech.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Mobile Technologies -->
        <div class="mb-16" data-aos="fade-up" v-if="mobileTech.length">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
            <i class="pi pi-mobile text-accent-600 dark:text-accent-400 mr-3"></i>
            {{ t('technologies.mobile') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(tech, index) in mobileTech" 
              :key="tech.id"
              class="card p-6"
              data-aos="fade-up"
              :data-aos-delay="index * 50"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 dark:text-accent-400 mr-4">
                  <i :class="[tech.icon, 'text-xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ getProficiencyLevel(tech.proficiency) }}
                  </p>
                </div>
              </div>
              <ProgressBar :value="tech.proficiency" :style="{ height: '8px' }" />
              <p v-if="tech.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Other Technologies -->
        <div data-aos="fade-up" v-if="otherTech.length">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center">
            <i class="pi pi-cog text-gray-600 dark:text-gray-400 mr-3"></i>
            {{ t('technologies.other') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              v-for="(tech, index) in otherTech" 
              :key="tech.id"
              class="card p-6"
              data-aos="fade-up"
              :data-aos-delay="index * 50"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-4">
                  <i :class="[tech.icon, 'text-xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ tech.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ getProficiencyLevel(tech.proficiency) }}
                  </p>
                </div>
              </div>
              <ProgressBar :value="tech.proficiency" :style="{ height: '8px' }" />
              <p v-if="tech.description" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {{ tech.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>