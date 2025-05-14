import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import AOS from 'aos'

// PrimeVue styles
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'
import 'aos/dist/aos.css'

// Import Tailwind CSS
import './style.css'

// Import App and routes
import App from './App.vue'
import { routes } from './router'
import { en, uk } from './locales'

// Create Pinia store
const pinia = createPinia()

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    uk
  }
})

// Initialize AOS
AOS.init({
  duration: 800,
  once: false,
})

// Create and mount the app
const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(pinia)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.component('Toast', Toast)

app.mount('#app')