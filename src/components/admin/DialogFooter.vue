<script setup>
import { defineProps, defineEmits } from 'vue';
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n';

defineProps({
  isLoading: Boolean,
  isValid: Boolean
});

defineEmits(['cancel', 'save']);

const { t } = useI18n();
</script>

<template>
  <section class="flex justify-end gap-4 mt-4">
    <Button
      :label="t('admin.common.cancel')"
      icon="pi pi-times"
      class="p-button-text"
      :disabled="isLoading"
      @click="$emit('cancel')"
  />
  <Button
      :label="t('admin.common.save')"
      icon="pi pi-check"
      class="p-button-primary"
      :disabled="!isValid || isLoading"
      :loading="isLoading"
      @click="$emit('save')"
  />
  </section>  
</template>