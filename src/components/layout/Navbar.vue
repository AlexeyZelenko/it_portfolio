<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Menu from 'primevue/menu'
import Button from 'primevue/button'

defineProps<{
  isDarkMode: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleDarkMode'): void
  (e: 'changeLanguage', lang: string): void
}>()

const { t, locale } = useI18n()
const mobileMenuOpen = ref(false)
const languageMenu = ref()

const languages = [
  { 
    label: 'English',
    icon: 'pi pi-flag',
    command: () => emit('changeLanguage', 'en')
  },
  { 
    label: 'Українська',
    icon: 'pi pi-flag',
    command: () => emit('changeLanguage', 'uk')
  }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleDarkMode = () => {
  emit('toggleDarkMode')
}

const toggleLanguageMenu = (event: Event) => {
  languageMenu.value.toggle(event)
}

const navItems = ['home', 'projects', 'technologies', 'experience', 'hobbies', 'contact']
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <div class="container flex h-16 items-center justify-between">
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">Portfolio</span>
        </router-link>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <router-link 
          v-for="item in navItems" 
          :key="item"
          :to="item === 'home' ? '/' : `/${item}`" 
          class="text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          :class="{ 'text-primary-600 dark:text-primary-400': $route.path === (item === 'home' ? '/' : `/${item}`) }"
        >
          {{ t(`nav.${item}`) }}
        </router-link>
        
        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-sun"
            v-if="isDarkMode"
            @click="toggleDarkMode"
            class="p-button-rounded p-button-text"
            aria-label="Toggle light mode"
          />
          <Button
            icon="pi pi-moon"
            v-else
            @click="toggleDarkMode"
            class="p-button-rounded p-button-text"
            aria-label="Toggle dark mode"
          />
          
          <Button
            :icon="locale === 'en' ? 'pi pi-flag' : 'pi pi-flag'"
            @click="toggleLanguageMenu"
            class="p-button-rounded p-button-text"
            aria-label="Change language"
          >
            {{ locale.toUpperCase() }}
          </Button>
          <Menu ref="languageMenu" :model="languages" :popup="true" />
        </div>
      </nav>
      
      <!-- Mobile Menu Button -->
      <div class="flex items-center md:hidden">
        <Button
          icon="pi pi-bars"
          @click="toggleMobileMenu"
          class="p-button-rounded p-button-text"
          aria-label="Menu"
        />
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="space-y-1 px-4 py-3 pb-4">
        <router-link 
          v-for="item in navItems" 
          :key="item"
          :to="item === 'home' ? '/' : `/${item}`" 
          class="block py-2 px-3 rounded-md text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-gray-100 dark:bg-gray-800': $route.path === (item === 'home' ? '/' : `/${item}`) }"
          @click="mobileMenuOpen = false"
        >
          {{ t(`nav.${item}`) }}
        </router-link>
        
        <div class="flex items-center justify-between pt-2">
          <Button
            :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            @click="toggleDarkMode"
            :label="isDarkMode ? t('theme.light') : t('theme.dark')"
            class="p-button-text"
          />
          
          <div class="flex items-center gap-2">
            <Button
              label="EN"
              :class="locale === 'en' ? 'p-button-primary' : 'p-button-outlined'"
              @click="() => emit('changeLanguage', 'en')"
              size="small"
            />
            <Button
              label="UK"
              :class="locale === 'uk' ? 'p-button-primary' : 'p-button-outlined'"
              @click="() => emit('changeLanguage', 'uk')"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>