<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useTechnologiesStore, type Technology } from '../../stores/technologies';
import { useToast } from 'primevue/usetoast';
import DialogFooter from './DialogFooter.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

const props = defineProps<{
  visible: boolean;
  technology?: Technology;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'saved': [];
}>();

const technologiesStore = useTechnologiesStore();
const toast = useToast();
const isLoading = ref(false);

const categories = [
  { name: 'Frontend', value: 'frontend' },
  { name: 'Backend', value: 'backend' },
  { name: 'Mobile', value: 'mobile' },
  { name: 'Other', value: 'other' }
];

const icons = [
  { name: 'Code', value: 'pi pi-code' },
  { name: 'Desktop', value: 'pi pi-desktop' },
  { name: 'Server', value: 'pi pi-server' },
  { name: 'Mobile', value: 'pi pi-mobile' },
  { name: 'Database', value: 'pi pi-database' },
  { name: 'Cloud', value: 'pi pi-cloud' },
  { name: 'Cog', value: 'pi pi-cog' }
];

const technologyForm = reactive<Omit<Technology, 'id'>>({
  name: '',
  category: 'frontend',
  proficiency: 80,
  icon: 'pi pi-code',
  description: ''
});

watch(() => props.visible, (visible) => {
  if (visible) resetForm();
});

const resetForm = () => {
  if (props.technology) {
    Object.assign(technologyForm, props.technology);
  } else {
    Object.assign(technologyForm, {
      name: '',
      category: 'frontend',
      proficiency: 80,
      icon: 'pi pi-code',
      description: ''
    });
  }
};

const saveTechnology = async () => {
  isLoading.value = true;
  try {
    if (props.technology?.id) {
      await technologiesStore.updateTechnology(props.technology.id, technologyForm);
      showSuccess('Technology updated successfully');
    } else {
      await technologiesStore.addTechnology(technologyForm);
      showSuccess('Technology added successfully');
    }
    closeDialog();
    emit('saved');
  } catch (error) {
    showError(error.message || 'Failed to save technology');
  } finally {
    isLoading.value = false;
  }
};

const showSuccess = (message: string) => {
  toast.add({ severity: 'success', detail: message, life: 3000 });
};

const showError = (message: string) => {
  toast.add({ severity: 'error', detail: message, life: 3000 });
};

const closeDialog = () => {
  emit('update:visible', false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    :header="technology ? 'Edit Technology' : 'Add New Technology'"
    modal
    class="w-full max-w-xl"
    @update:visible="closeDialog"
  >
    <div class="space-y-4">
      <div class="field">
        <label for="name" class="block mb-2 font-medium">Name*</label>
        <InputText
          id="name"
          v-model="technologyForm.name"
          class="w-full"
          required
        />
      </div>

      <div class="field">
        <label for="category" class="block mb-2 font-medium">Category*</label>
        <Dropdown
          id="category"
          v-model="technologyForm.category"
          :options="categories"
          optionLabel="name"
          optionValue="value"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="proficiency" class="block mb-2 font-medium">Proficiency*</label>
        <InputNumber
          id="proficiency"
          v-model="technologyForm.proficiency"
          :min="0"
          :max="100"
          suffix="%"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="icon" class="block mb-2 font-medium">Icon*</label>
        <Dropdown
          id="icon"
          v-model="technologyForm.icon"
          :options="icons"
          optionLabel="name"
          optionValue="value"
          class="w-full"
        >
          <template #option="{ option }">
            <i :class="option.value" class="mr-2"></i>
            {{ option.name }}
          </template>
        </Dropdown>
      </div>

      <div class="field">
        <label for="description" class="block mb-2 font-medium">Description</label>
        <Textarea
          id="description"
          v-model="technologyForm.description"
          rows="3"
          class="w-full"
        />
      </div>
    </div>

    <DialogFooter
      :is-loading="isLoading"
      :is-valid="!!technologyForm.name"
      @cancel="closeDialog"
      @save="saveTechnology"
    />
  </Dialog>
</template>