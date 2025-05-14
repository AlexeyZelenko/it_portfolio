<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'
import { useProjectsStore } from '../stores/projects'

// Определение интерфейсов
interface ProjectImage {
  url: string;
  alt?: string;
}

interface Testimonial {
  content: string;
  author: string;
  position: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  client: string;
  date: string;
  technologies: string;
  features: string[];
  images: ProjectImage[];
  liveUrl?: string;
  sourceUrl?: string;
  testimonial?: Testimonial;
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const projectsStore = useProjectsStore()
const projectId = route.params.id as string

const project = ref<Project | null>(null)

const relatedProjects = ref<Project[]>([])

// Функция для получения связанных проектов (исключая текущий проект)
const fetchRelatedProjects = async (): Promise<void> => {
  // Получаем все проекты
  await projectsStore.fetchProjects()

  // Фильтруем проекты, исключая текущий
  //@ts-ignore
  const filteredProjects = projectsStore.projects.filter((p: Project) => p.id !== projectId)

  // Выбираем 3 случайных проекта из отфильтрованных
  const randomProjects: Project[] = []
  const projectsCopy = [...filteredProjects]

  // Определяем количество проектов для выбора (не более 3 или всех доступных)
  const count = Math.min(3, projectsCopy.length)

  // Выбираем случайные проекты
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * projectsCopy.length)
    //@ts-ignore
    randomProjects.push(projectsCopy[randomIndex])
    projectsCopy.splice(randomIndex, 1) // Удаляем выбранный проект, чтобы избежать дубликатов
  }

  relatedProjects.value = randomProjects
}

// Обработчики событий для открытия ссылок
const openUrl = (url: string | undefined): void => {
  if (url) {
    window.open(url, '_blank');
  }
};

onMounted(async (): Promise<void> => {
  console.log('Project ID:', projectId)
  if (!projectId) {
    router.push('/projects')
  } else {
    // Получаем детали текущего проекта
    await projectsStore.fetchProjects()
    //@ts-ignore
    project.value = projectsStore.projects.find((p: Project) => p.id === projectId) || null
    console.log('Project Details:', project.value)

    // Получаем связанные проекты
    await fetchRelatedProjects()
  }
})
</script>

<template>
  <div v-if="project">
    <!-- Project Header -->
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Button
                icon="pi pi-arrow-left"
                label="Back to Projects"
                class="p-button-text mb-4"
                @click="router.push('/projects')"
            />
            <h1 class="text-3xl md:text-5xl font-bold" data-aos="fade-up">
              {{ project.title }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg mt-2" data-aos="fade-up" data-aos-delay="100">
              {{ project.subtitle }}
            </p>
          </div>
          <div class="flex gap-3" data-aos="fade-up" data-aos-delay="200">
            <Button
                v-if="project.liveUrl"
                :label="t('projects.visit')"
                icon="pi pi-external-link"
                class="p-button-primary"
                @click="openUrl(project.liveUrl)"
            />
            <Button
                v-if="project.sourceUrl"
                :label="t('projects.source')"
                icon="pi pi-github"
                class="p-button-outlined"
                @click="openUrl(project.sourceUrl)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Project Content -->
    <section class="section bg-white dark:bg-gray-800 pt-0">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Project Images -->
            <div class="overflow-hidden mb-8" data-aos="fade-up">
              <Carousel :value="project.images" :numVisible="1" :numScroll="1" :showIndicators="true" class="border-none shadow-none">
                <template #item="slotProps">
                  <div class="p-2">
                    <img :src="slotProps.data.url" :alt="project.title" class="w-full h-96 object-cover rounded" />
                  </div>
                </template>
              </Carousel>
            </div>

            <!-- Project Details Tabs -->
            <div data-aos="fade-up" data-aos-delay="100">
              <TabView>
                <TabPanel header="Overview">
                  <div class="py-4">
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {{ project.description }}
                    </p>

                    <h3 class="text-xl font-semibold mt-8 mb-4">Key Features</h3>
                    <ul class="space-y-2">
                      <li
                          v-for="(feature, index) in project.features"
                          :key="index"
                          class="flex items-start"
                      >
                        <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2 mt-1"></i>
                        <span>{{ feature }}</span>
                      </li>
                    </ul>
                  </div>
                </TabPanel>

                <TabPanel header="Technologies">
                  <div class="py-4">
                    <h3 class="text-xl font-semibold mb-4">Technologies Used</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div
                          v-for="(tech, index) in project.technologies.split(',')"
                          :key="index"
                          class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <i class="pi pi-code text-primary-600 dark:text-primary-400 mr-3"></i>
                        <span>{{ tech }}</span>
                      </div>
                    </div>

                    <h3 class="text-xl font-semibold mt-8 mb-4">Development Process</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-4">
                      This project was developed using an agile methodology, with a focus on iterative development and continuous feedback. The development process included:
                    </p>
                    <ol class="list-decimal list-inside space-y-2 pl-4">
                      <li>Requirements gathering and user research</li>
                      <li>Wireframing and UI/UX design</li>
                      <li>Frontend and backend development</li>
                      <li>Testing and quality assurance</li>
                      <li>Deployment and monitoring</li>
                    </ol>
                  </div>
                </TabPanel>

                <TabPanel header="Results">
                  <div class="py-4">
                    <h3 class="text-xl font-semibold mb-4">Project Outcomes</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-6">
                      This project has achieved significant results and positive outcomes for the client, including:
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">+45%</div>
                        <div class="text-gray-700 dark:text-gray-300">User Engagement</div>
                      </div>
                      <div class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">-30%</div>
                        <div class="text-gray-700 dark:text-gray-300">Loading Time</div>
                      </div>
                      <div class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">+60%</div>
                        <div class="text-gray-700 dark:text-gray-300">Conversion Rate</div>
                      </div>
                    </div>

                    <div v-if="project.testimonial" class="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <blockquote class="text-gray-700 dark:text-gray-300 italic mb-4">
                        "{{ project.testimonial.content }}"
                      </blockquote>
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary-600 dark:bg-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                          {{ project.testimonial.author.charAt(0) }}
                        </div>
                        <div class="ml-3">
                          <div class="font-semibold">{{ project.testimonial.author }}</div>
                          <div class="text-sm text-gray-600 dark:text-gray-400">{{ project.testimonial.position }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="card sticky top-24" data-aos="fade-up" data-aos-delay="200">
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-4">Project Information</h3>

                <div class="space-y-4">
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Category</div>
                    <div class="font-medium">{{ project.category }}</div>
                  </div>

                  <Divider />

                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Client</div>
                    <div class="font-medium">{{ project.client }}</div>
                  </div>

                  <Divider />

                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Date</div>
                    <div class="font-medium">{{ project.date }}</div>
                  </div>

                  <Divider />

                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('projects.technologies') }}</div>
                    <div class="flex flex-wrap gap-2">
                      <span
                          v-for="tech in project.technologies.split(',')"
                          :key="tech"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-1 gap-3">
                  <Button
                      v-if="project.liveUrl"
                      :label="t('projects.visit')"
                      icon="pi pi-external-link"
                      class="p-button-primary w-full"
                      @click="openUrl(project.liveUrl)"
                  />
                  <Button
                      v-if="project.sourceUrl"
                      :label="t('projects.source')"
                      icon="pi pi-github"
                      class="p-button-outlined w-full"
                      @click="openUrl(project.sourceUrl)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Projects -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <h2 class="text-2xl md:text-3xl font-bold mb-12 text-center" data-aos="fade-up">
          Related Projects
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
              v-for="(relatedProject, index) in relatedProjects"
              :key="relatedProject.id"
              class="card group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
              @click="router.push(`/projects/${relatedProject.id}`)"
          >
            <div class="relative overflow-hidden">
              <img
                  :src="relatedProject.images && relatedProject.images.length > 0 ? relatedProject.images[0].url : ''"
                  :alt="relatedProject.title"
                  class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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
            <div class="p-4">
              <h3 class="text-lg font-semibold">{{ relatedProject.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ relatedProject.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>