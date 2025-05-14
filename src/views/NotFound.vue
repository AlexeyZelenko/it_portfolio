<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
      <h2 class="text-3xl font-semibold mt-4 mb-2">{{ t('notFound.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">{{ t('notFound.message') }}</p>
      <Button 
        :label="t('notFound.back')" 
        icon="pi pi-home" 
        class="p-button-primary" 
        @click="router.push('/')"
      />
    </div>
  </div>
</template>