<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';

const route = useRoute();
const { t: _t, locale } = useI18n();
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light');
  updateDarkMode();
};

const updateDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
};

const transitionName = (route: RouteLocationNormalizedLoaded): string => {
  return (route.meta.transitionName as string) || 'fade';
};

onMounted(() => {
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode');
  isDarkMode.value = savedDarkMode === 'dark';
  updateDarkMode();

  // Check for saved language preference
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
});

watch(
    () => route.path,
    () => {
      window.scrollTo(0, 0);
    }
);
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar
        :isDarkMode="isDarkMode"
        @toggle-dark-mode="toggleDarkMode"
        @change-language="changeLanguage"
    />

    <main class="flex-grow">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName(route)" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>