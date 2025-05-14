<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useExperiencesStore } from '../stores/experiences'
import Timeline from 'primevue/timeline'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'

const { t, locale } = useI18n()
const router = useRouter()
const experiencesStore = useExperiencesStore()
const experiences = computed(() => {
  return experiencesStore.experiences.filter(exp => {
    console.log("locale.value", locale.value);
    
    // Если у опыта нет языковых настроек, показываем его всегда
    if (!exp.language) {
      return true;
    }
    // Иначе показываем только если текущий язык есть в списке языков опыта
    return exp.language?.value?.includes(locale.value);
  });
});

const skills = {
  technical: [
    { name: 'Frontend Architecture', level: 95 },
    { name: 'Backend Development', level: 85 },
    { name: 'Database Design', level: 90 },
    { name: 'System Design', level: 85 },
    { name: 'DevOps & CI/CD', level: 80 }
  ],
  soft: [
    { name: 'Team Leadership', level: 90 },
    { name: 'Problem Solving', level: 95 },
    { name: 'Communication', level: 90 },
    { name: 'Project Management', level: 85 },
    { name: 'Mentoring', level: 90 }
  ]
}

const certifications = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023',
    icon: 'pi pi-cloud'
  },
  {
    name: 'Professional Scrum Master I',
    issuer: 'Scrum.org',
    date: '2022',
    icon: 'pi pi-check-circle'
  },
  {
    name: 'Vue.js Advanced Developer',
    issuer: 'Vue.js Organization',
    date: '2021',
    icon: 'pi pi-code'
  }
]

const navigateToDetail = (id: string) => {
  router.push(`/experience/${id}`)
}

onMounted(async () => {
  await experiencesStore.fetchExperiences()
})
</script>

<template>  
  <div v-if="experiences && experiences.length">
    <!-- Experience Header -->
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
          Professional Experience
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          A journey through my professional career in software development
        </p>
      </div>
    </section>

    <!-- Work Experience Timeline -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <h2 class="text-2xl md:text-3xl font-bold mb-12" data-aos="fade-up">Work Experience</h2>
        
        <div class="space-y-8">
          <div 
            v-for="(job, index) in experiences" 
            :key="index"
            class="card p-6 cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
            @click="navigateToDetail(job.id)"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <div class="md:w-1/3">
                <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400">{{ job.position }}</h3>
                <p class="text-lg font-medium mb-2">{{ job.company }}</p>
                <div class="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <i class="pi pi-calendar mr-2"></i>
                  <span>{{ job.period }}</span>
                </div>
                <div class="flex items-center text-gray-600 dark:text-gray-400">
                  <i class="pi pi-map-marker mr-2"></i>
                  <span>{{ job.location }}</span>
                </div>
              </div>
              
              <div class="md:w-2/3">
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                  {{ job.description }}
                </p>
                
                <h4 class="font-semibold mb-2">Key Achievements:</h4>
                <ul class="space-y-2 mb-4">
                  <li 
                    v-for="(achievement, i) in job.achievements" 
                    :key="i"
                    class="flex items-start"
                  >
                    <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2 mt-1"></i>
                    <span>{{ achievement }}</span>
                  </li>
                </ul>
                
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in job.technologies" 
                    :key="tech"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {{ tech }}
                  </span>
                </div>
                
                <Button 
                  label="View Details" 
                  icon="pi pi-arrow-right" 
                  class="p-button-text mt-4"
                  @click.stop="navigateToDetail(job.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <h2 class="text-2xl md:text-3xl font-bold mb-12" data-aos="fade-up">Skills & Expertise</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Technical Skills -->
          <div data-aos="fade-up">
            <h3 class="text-xl font-semibold mb-6">Technical Skills</h3>
            <div class="space-y-6">
              <div v-for="skill in skills.technical" :key="skill.name">
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ skill.name }}</span>
                  <span>{{ skill.level }}%</span>
                </div>
                <ProgressBar :value="skill.level" :style="{ height: '8px' }" />
              </div>
            </div>
          </div>
          
          <!-- Soft Skills -->
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 class="text-xl font-semibold mb-6">Soft Skills</h3>
            <div class="space-y-6">
              <div v-for="skill in skills.soft" :key="skill.name">
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ skill.name }}</span>
                  <span>{{ skill.level }}%</span>
                </div>
                <ProgressBar :value="skill.level" :style="{ height: '8px' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <h2 class="text-2xl md:text-3xl font-bold mb-12" data-aos="fade-up">Certifications</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="cert in certifications" 
            :key="cert.name"
            class="card p-6"
            data-aos="fade-up"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                <i :class="[cert.icon, 'text-2xl']"></i>
              </div>
              <div>
                <h3 class="font-semibold">{{ cert.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ cert.issuer }}</p>
              </div>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-400">
              <i class="pi pi-calendar mr-2"></i>
              <span>{{ cert.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>