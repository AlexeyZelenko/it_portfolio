<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import Button from 'primevue/button'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
const authStore = useAuthStore()

const handleAdminClick = async () => {
  if (!authStore.user) {
    try {
      await authStore.login()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
</script>

<template>
  <footer class="bg-gray-100 dark:bg-gray-800 py-12">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <router-link to="/" class="flex items-center space-x-2 mb-4">
            <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">Portfolio</span>
          </router-link>
          <p class="text-gray-600 dark:text-gray-400 max-w-md">
            Building exceptional digital experiences with modern technologies and creative solutions.
          </p>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li v-for="item in ['home', 'projects', 'technologies', 'contact']" :key="item">
              <router-link 
                :to="item === 'home' ? '/' : `/${item}`" 
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {{ t(`nav.${item}`) }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-4">Connect</h3>
          <ul class="space-y-2">
            <li>
              <a href="https://github.com/AlexeyZelenko" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <i class="pi pi-github mr-2"></i> GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/oleksii-zelenko-523a3a1a1/" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <i class="pi pi-linkedin mr-2"></i> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://t.me/creator_oleksii" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <i class="pi pi-telegram mr-2"></i> Telegram
              </a>
            </li>
            <li>
              <a href="mailto:pro.inﬁnite.box@gmail.com" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                <i class="pi pi-envelope mr-2"></i> Email
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {{ currentYear }} Portfolio. All rights reserved.
        </p>
        <div class="flex items-center space-x-6 mt-4 md:mt-0">
          <a href="https://github.com/AlexeyZelenko" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i class="pi pi-github text-xl"></i>
          </a>
          <a href="https://www.linkedin.com/in/oleksii-zelenko-523a3a1a1/" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i class="pi pi-linkedin text-xl"></i>
          </a>
          <a href="https://t.me/creator_oleksii" target="_blank" rel="noopener noreferrer" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i class="pi pi-telegram text-xl"></i>
          </a>
          <div class="border-l border-gray-200 dark:border-gray-700 pl-6">
            <Button
              v-if="!authStore.user"
              icon="pi pi-user"
              label="Admin"
              class="p-button-text p-button-sm"
              @click="handleAdminClick"
            />
            <router-link
              v-else-if="authStore.isAdmin"
              to="/admin"
              class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
            >
              <i class="pi pi-cog mr-2"></i> Admin Panel
            </router-link>
            <Button
              v-else
              icon="pi pi-sign-out"
              label="Logout"
              class="p-button-text p-button-sm p-button-danger"
              @click="authStore.logout"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>