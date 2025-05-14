<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import Button from 'primevue/button'

const { t } = useI18n()
const authStore = useAuthStore()

const openResume = () => {
  if (authStore.resumeUrl) {
    window.open(authStore.resumeUrl, '_blank')
  }
}

onMounted(async () => {
  await authStore.loadResumeUrl()
})

const contactInfo = [
  {
    icon: 'pi pi-phone',
    title: 'Phone',
    value: '+380 (99) 123-45-67',
    link: 'tel:+380991234567'
  },
  {
    icon: 'pi pi-telegram',
    title: 'Telegram',
    value: '@username',
    link: 'https://t.me/username'
  },
  {
    icon: 'pi pi-linkedin',
    title: 'LinkedIn',
    value: 'John Doe',
    link: 'https://linkedin.com/in/johndoe'
  },
  {
    icon: 'pi pi-envelope',
    title: 'Email',
    value: 'contact@example.com',
    link: 'mailto:contact@example.com'
  }
]
</script>

<template>
  <div>
    <!-- Contact Header -->
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
          {{ t('contact.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6" data-aos="fade-up" data-aos-delay="100">
          {{ t('contact.subtitle') }}
        </p>
        <Button
            v-if="authStore.resumeUrl"
            label="Download Resume"
            icon="pi pi-download"
            class="p-button-primary"
            @click="openResume"
            data-aos="fade-up"
            data-aos-delay="200"
        />
      </div>
    </section>

    <!-- Contact Information -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Contact Image -->
          <div data-aos="fade-right">
            <div class="card overflow-hidden h-full">
              <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Contact"
                  class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Contact Details -->
          <div data-aos="fade-left">
            <div class="space-y-8">
              <div
                  v-for="(info, index) in contactInfo"
                  :key="index"
                  class="flex items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg transition-transform hover:scale-105"
              >
                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                  <i :class="[info.icon, 'text-2xl']"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ info.title }}</h3>
                  <a
                      :href="info.link"
                      class="text-primary-600 dark:text-primary-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    {{ info.value }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Location Section -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Location</h2>
          <p class="text-gray-600 dark:text-gray-400">Based in Kyiv, Ukraine</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
              v-for="(info, index) in [
              { title: 'Time Zone', value: 'UTC+3', icon: 'pi pi-clock' },
              { title: 'Working Hours', value: '9:00 AM - 6:00 PM', icon: 'pi pi-calendar' },
              { title: 'Availability', value: 'Remote Worldwide', icon: 'pi pi-globe' }
            ]"
              :key="index"
              class="card p-6 text-center"
              data-aos="fade-up"
              :data-aos-delay="index * 100"
          >
            <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-4">
              <i :class="[info.icon, 'text-2xl']"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ info.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ info.value }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>