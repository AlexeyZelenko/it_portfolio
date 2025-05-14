<script setup>
import { defineProps, defineEmits } from 'vue';
import Button from 'primevue/button';

defineProps({
  isLoading: Boolean,
  isValid: Boolean
});

defineEmits(['cancel', 'save']);
</script>

<template>
  <section class="flex justify-end gap-4 mt-4">
    <Button
      label="Cancel"
      icon="pi pi-times"
      class="p-button-text"
      :disabled="isLoading"
      @click="$emit('cancel')"
  />
  <Button
      label="Save"
      icon="pi pi-check"
      class="p-button-primary"
      :disabled="!isValid || isLoading"
      :loading="isLoading"
      @click="$emit('save')"
  />
  </section>  
</template>