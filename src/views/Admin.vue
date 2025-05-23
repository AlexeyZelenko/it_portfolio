<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useProjectsStore } from '../stores/projects';
import { useExperiencesStore } from '../stores/experiences';
import { useTechnologiesStore } from '../stores/technologies';
import { useHobbiesStore } from '../stores/hobbies';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ProjectsList from '../components/admin/ProjectsList.vue';
import ProjectDialog from '../components/admin/ProjectDialog.vue';
import ExperiencesList from '../components/admin/ExperiencesList.vue';
import ExperienceDialog from '../components/admin/ExperienceDialog.vue';
import TechnologyDialog from '../components/admin/TechnologyDialog.vue';
import HobbiesList from '../components/admin/HobbiesList.vue';
import HobbyDialog from '../components/admin/HobbyDialog.vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';

const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const experiencesStore = useExperiencesStore();
const technologiesStore = useTechnologiesStore();
const hobbiesStore = useHobbiesStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const projectDialogVisible = ref(false);
const experienceDialogVisible = ref(false);
const technologyDialogVisible = ref(false);
const hobbyDialogVisible = ref(false);
const editingProject = ref(null);
const editingExperience = ref(null);
const editingTechnology = ref(null);
const editingHobby = ref(null);
const isProjectsLoading = ref(false);
const isExperiencesLoading = ref(false);
const isTechnologiesLoading = ref(false);
const isHobbiesLoading = ref(false);
const isUploadingResume = ref(false);

const handleResumeUpload = async (event) => {
  if (!event.files || !event.files[0]) return;
  
  const file = event.files[0];
  if (file.type !== 'application/pdf') {
    toast.add({ severity: 'error', detail: t('admin.resume.fileTypeError'), life: 3000 });
    return;
  }

  isUploadingResume.value = true;
  try {
    await authStore.uploadResume(file);
    toast.add({ severity: 'success', detail: t('admin.resume.success'), life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', detail: t('admin.resume.error'), life: 3000 });
  } finally {
    isUploadingResume.value = false;
  }
};

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/');
    return;
  }

  await loadProjects();
  await loadExperiences();
  await loadTechnologies();
  await loadHobbies();
  await authStore.loadResumeUrl();
});

const loadProjects = async () => {
  isProjectsLoading.value = true;
  try {
    await projectsStore.fetchProjects();
  } catch (error) {
    showToast('error', 'Failed to load projects');
  } finally {
    isProjectsLoading.value = false;
  }
};

const deleteProject = async (project) => {
  try {
    await projectsStore.deleteProject(project.id);
    showToast('success', t('admin.projects.delete'));
    await loadProjects();
  } catch (error) {
    showToast('error', t('admin.projects.deleteError'));
  }
};

const deleteExperiense = async (experience) => {
  try {
    await experiencesStore.deleteExperience(experience.id);
    showToast('success', t('admin.experience.delete'));
    await loadExperiences();
  } catch (error) {
    showToast('error', t('admin.experience.deleteError'));
  }
}

const loadExperiences = async () => {
  isExperiencesLoading.value = true;
  try {
    await experiencesStore.fetchExperiences();
  } catch (error) {
    showToast('error', t('admin.experience.deleteError'));
  } finally {
    isExperiencesLoading.value = false;
  }
};

const loadTechnologies = async () => {
  isTechnologiesLoading.value = true;
  try {
    await technologiesStore.fetchTechnologies();
  } catch (error) {
    showToast('error', 'Failed to load technologies');
  } finally {
    isTechnologiesLoading.value = false;
  }
};

const loadHobbies = async () => {
  isHobbiesLoading.value = true;
  try {
    await hobbiesStore.fetchHobbies();
  } catch (error) {
    showToast('error', t('admin.hobbies.deleteError'));
  } finally {
    isHobbiesLoading.value = false;
  }
};

const showToast = (severity, detail) => {
  toast.add({ severity, detail, life: 3000 });
};

const showProjectDialog = (project = null) => {
  editingProject.value = project;
  projectDialogVisible.value = true;
};

const showExperienceDialog = (experience = null) => {
  editingExperience.value = experience;
  experienceDialogVisible.value = true;
};

const showTechnologyDialog = (technology = null) => {
  editingTechnology.value = technology;
  technologyDialogVisible.value = true;
};

const showHobbyDialog = (hobby = null) => {
  editingHobby.value = hobby;
  hobbyDialogVisible.value = true;
};

const handleProjectSaved = () => {
  projectDialogVisible.value = false;
  loadProjects();
};

const handleExperienceSaved = () => {
  experienceDialogVisible.value = false;
  loadExperiences();
};

const handleTechnologySaved = () => {
  technologyDialogVisible.value = false;
  loadTechnologies();
};

const handleHobbySaved = () => {
  hobbyDialogVisible.value = false;
  loadHobbies();
};

const deleteTechnology = async (technology) => {
  try {
    await technologiesStore.deleteTechnology(technology.id);
    showToast('success', t('admin.technologies.delete'));
    await loadTechnologies();
  } catch (error) {
    showToast('error', t('admin.technologies.deleteError'));
  }
};
</script>

<template>
  <div class="p-6 max-w-[1460px] m-auto">
    <Toast />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ t('admin.title') }}</h1>
      <Button
        :label="t('admin.logout')"
        icon="pi pi-sign-out"
        class="p-button-danger"
        @click="authStore.logout"
      />
    </div>

    <TabView>
      <TabPanel :header="t('admin.projects.title')">
        <div class="mb-4">
          <Button
            :label="t('admin.projects.addNew')"
            icon="pi pi-plus"
            :disabled="isProjectsLoading"
            @click="showProjectDialog()"
          />
        </div>

        <ProjectsList
          :projects="projectsStore.projects"
          :isLoading="isProjectsLoading"
          @edit="showProjectDialog"
          @delete="deleteProject"
        />

        <ProjectDialog
          v-model:visible="projectDialogVisible"
          :project="editingProject"
          :modal="true"
          @saved="handleProjectSaved"
        />
      </TabPanel>

      <TabPanel :header="t('admin.experience.title')">
        <div class="mb-4">
          <Button
            :label="t('admin.experience.addNew')"
            icon="pi pi-plus"
            :disabled="isExperiencesLoading"
            @click="showExperienceDialog()"
          />
        </div>

        <ExperiencesList
          :experiences="experiencesStore.experiences"
          :isLoading="isExperiencesLoading"
          @edit="showExperienceDialog"
          @delete="deleteExperiense"
        />

        <ExperienceDialog
          v-model:visible="experienceDialogVisible"
          :experience="editingExperience"
          :modal="true"
          @saved="handleExperienceSaved"
        />
      </TabPanel>

      <TabPanel :header="t('admin.technologies.title')">
        <div class="mb-4">
          <Button
            :label="t('admin.technologies.addNew')"
            icon="pi pi-plus"
            :disabled="isTechnologiesLoading"
            @click="showTechnologyDialog()"
          />
        </div>

        <DataTable
          :value="technologiesStore.technologies"
          :loading="isTechnologiesLoading"
          class="p-datatable-sm"
        >
          <Column field="name" :header="t('admin.technologies.name')" />
          <Column field="category" :header="t('admin.technologies.category')" />
          <Column field="proficiency" :header="t('admin.technologies.proficiency')">
            <template #body="slotProps">
              {{ slotProps.data.proficiency }}%
            </template>
          </Column>
          <Column field="icon" :header="t('admin.technologies.icon')">
            <template #body="slotProps">
              <i :class="slotProps.data.icon"></i>
            </template>
          </Column>
          <Column :header="t('admin.common.actions')">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-sm mr-2"
                @click="showTechnologyDialog(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-sm p-button-danger"
                @click="deleteTechnology(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <TechnologyDialog
          v-model:visible="technologyDialogVisible"
          :technology="editingTechnology"
          @saved="handleTechnologySaved"
        />
      </TabPanel>
      
      <TabPanel :header="t('admin.hobbies.title')">
        <div class="mb-4">
          <Button
            :label="t('admin.hobbies.addNew')"
            icon="pi pi-plus"
            :disabled="isHobbiesLoading"
            @click="showHobbyDialog()"
          />
        </div>

        <HobbiesList
          :hobbies="hobbiesStore.hobbies"
          :isLoading="isHobbiesLoading"
          @edit="showHobbyDialog"
          @delete="loadHobbies"
        />

        <HobbyDialog
          v-model:visible="hobbyDialogVisible"
          :hobby="editingHobby"
          :modal="true"
          @saved="handleHobbySaved"
        />
      </TabPanel>

      <TabPanel :header="t('admin.resume.title')">
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">{{ t('admin.resume.title') }}</h2>
          
          <div class="mb-4">
            <FileUpload
              mode="basic"
              :auto="true"
              accept="application/pdf"
              :maxFileSize="5000000"
              :chooseLabel="t('admin.resume.upload')"
              @select="handleResumeUpload"
              :loading="isUploadingResume"
            />
          </div>
          
          <div v-if="authStore.resumeUrl" class="mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ t('admin.resume.current') }}</p>
            <div class="flex items-center gap-4">
              <a 
                :href="authStore.resumeUrl" 
                target="_blank" 
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {{ t('admin.resume.view') }}
              </a>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>