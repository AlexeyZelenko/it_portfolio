<script setup>
import { formatDate } from '../../utils/helpers';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

defineProps({
  experiences: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
});

const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div v-if="isLoading" class="flex justify-center my-8">
    <i class="pi pi-spin pi-spinner text-4xl"></i>
  </div>

  <div v-else-if="!experiences.length" class="text-center my-8">
    <p class="text-gray-500">No experiences found. Add your first experience!</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card
      v-for="experience in experiences"
      :key="experience.id"
      class="shadow-md hover:shadow-lg transition-shadow"
    >
      <template #title>
        <div class="flex items-center">
          <h3 class="text-xl">{{ experience.position }}</h3>
        </div>
      </template>

      <template #subtitle>
        <p class="text-sm text-gray-600">
          {{ experience.company }} | {{ experience.location }}
        </p>
      </template>

      <template #content>
        <p class="mb-2">{{ experience.description }}</p>

        <div v-if="experience.technologies?.length" class="mb-2">
          <span
            v-for="tech in experience.technologies"
            :key="tech"
            class="inline-block bg-gray-100 text-xs px-2 py-1 rounded mr-1 mb-1"
          >
            {{ tech }}
          </span>
        </div>

        <small class="text-gray-500 block">
          Period: {{ experience.period }}
        </small>

        <Divider />

        <div class="flex justify-end gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-sm"
            @click="$emit('edit', experience)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-sm p-button-danger"
            @click="$emit('delete', experience)"
          />
        </div>
      </template>
    </Card>
  </div>
</template>