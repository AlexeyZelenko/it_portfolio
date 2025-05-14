<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useExperiencesStore } from '../stores/experiences';

// Определение интерфейсов для данных
interface Project {
  name: string;
  description: string;
  impact: string;
  technologies: string[];
}

interface Experience {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  responsibilities: string[];
  technologies: string[];
  projects: Project[];
}

// Определение интерфейса для хранилища опыта
interface ExperiencesStore {
  experiences: Experience[];
  fetchExperiences: () => Promise<void>;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const experiencesStore = useExperiencesStore() as ExperiencesStore; // Явное приведение типа
const experiences = ref<Experience[]>([]);

const currentExperience = computed<Experience | undefined>(() =>
    experiences.value.find((experience) => experience.id === route.params.id)
);

onMounted(async () => {
  await experiencesStore.fetchExperiences();
  experiences.value = experiencesStore.experiences;

  if (!currentExperience.value) {
    router.push('/experience');
  } else {
    console.log(currentExperience.value);
  }
});
</script>

<template>
  <div v-if="currentExperience">
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Button
                icon="pi pi-arrow-left"
                :label="t('experience.backToExperience')"
                class="p-button-text mb-4"
                @click="router.push('/experience')"
            />
            <h1 class="text-3xl md:text-5xl font-bold" data-aos="fade-up">
              {{ currentExperience.position }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg mt-2" data-aos="fade-up" data-aos-delay="100">
              {{ currentExperience.company }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-white dark:bg-gray-800 pt-0">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2">
            <TabView>
              <TabPanel :header="t('experience.overview')">
                <div class="py-4">
                  <p class="text-gray-700 dark:text-gray-300 mb-6">
                    {{ currentExperience.description }}
                  </p>

                  <h3 class="text-xl font-semibold mb-4">{{ t('experience.keyAchievements') }}</h3>
                  <ul class="space-y-3 mb-6">
                    <li
                        v-for="(achievement, index) in currentExperience.achievements"
                        :key="index"
                        class="flex items-start"
                    >
                      <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2 mt-1"></i>
                      <span>{{ achievement }}</span>
                    </li>
                  </ul>

                  <h3 class="text-xl font-semibold mb-4">{{ t('experience.coreResponsibilities') }}</h3>
                  <ul class="space-y-3">
                    <li
                        v-for="(responsibility, index) in currentExperience.responsibilities"
                        :key="index"
                        class="flex items-start"
                    >
                      <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2 mt-1"></i>
                      <span>{{ responsibility }}</span>
                    </li>
                  </ul>
                </div>
              </TabPanel>

              <TabPanel :header="t('experience.projects')">
                <div class="py-4">
                  <div
                      v-for="(project, index) in currentExperience.projects"
                      :key="index"
                      class="card p-6 mb-6"
                  >
                    <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                      {{ project.description }}
                    </p>

                    <div class="flex items-center text-primary-600 dark:text-primary-400 mb-4">
                      <i class="pi pi-chart-line mr-2"></i>
                      <span class="font-medium">{{ t('experience.impact') }}: {{ project.impact }}</span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                          v-for="tech in project.technologies"
                          :key="tech"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel :header="t('experience.technologies')">
                <div class="py-4">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div
                        v-for="tech in currentExperience.technologies"
                        :key="tech"
                        class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <i class="pi pi-code text-primary-600 dark:text-primary-400 mr-3"></i>
                      <span>{{ tech }}</span>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>

          <div class="lg:col-span-1">
            <div class="card sticky top-24">
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('experience.period') }}</div>
                    <div class="font-medium flex items-center">
                      <i class="pi pi-calendar mr-2"></i>
                      {{ currentExperience.period }}
                    </div>
                  </div>

                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('experience.location') }}</div>
                    <div class="font-medium flex items-center">
                      <i class="pi pi-map-marker mr-2"></i>
                      {{ currentExperience.location }}
                    </div>
                  </div>

                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('experience.technologies') }}</div>
                    <div class="flex flex-wrap gap-2">
                      <span
                          v-for="tech in currentExperience.technologies"
                          :key="tech"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.p-tabview-nav li.p-highlight a {
  background-color: #e9ecef; /* Або інший колір на ваш вибір */
  color: #495057; /* Колір тексту активного таба */
  font-weight: bold; /* За потреби, зробити текст жирним */
}

.dark .p-tabview-nav li.p-highlight a {
  background-color: #343a40; /* Колір для темної теми */
  color: #f8f9fa; /* Колір тексту для темної теми */
}
</style>