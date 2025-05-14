<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Carousel from 'primevue/carousel'
import { useHobbiesStore } from '../stores/hobbies'

const { t } = useI18n()
const hobbiesStore = useHobbiesStore()
const loading = ref(true)

// Получаем хобби из Firebase
onMounted(async () => {
  try {
    await hobbiesStore.fetchHobbies()
  } catch (error) {
    console.error('Ошибка при загрузке хобби:', error)
  } finally {
    loading.value = false
  }
})

// Получаем хобби по типу
const getMusicHobby = computed(() => {
  return hobbiesStore.hobbies.find(hobby => hobby.type === 'music') || {
    title: t('hobbies.music.title'),
    description: t('hobbies.music.description'),
    equipment: ['Professional recording equipment', 'Digital audio workstation', 'Acoustic treatment'],
    photos: [
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
})

const getFishingHobby = computed(() => {
  return hobbiesStore.hobbies.find(hobby => hobby.type === 'fishing') || {
    title: t('hobbies.fishing.title'),
    description: t('hobbies.fishing.description'),
    equipment: ['Professional spinning rods', 'Various lures and baits', 'Fish finder technology'],
    photos: [
      'https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5560867/pexels-photo-5560867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2931290/pexels-photo-2931290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
})
</script>

<template>
  <div>
    <!-- Hobbies Header -->
    <section class="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div class="container text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
          {{ t('hobbies.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ t('hobbies.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Music Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 class="text-3xl font-bold mb-6">{{ getMusicHobby.title || t('hobbies.music.title') }}</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold mb-2">{{ t('hobbies.music.guitar') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ getMusicHobby.description || t('hobbies.music.description') }}
                </p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">{{ t('hobbies.music.studio') }}</h3>
                <ul class="space-y-2">
                  <li v-for="(item, index) in getMusicHobby.equipment" :key="index" class="flex items-center">
                    <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2"></i>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div data-aos="fade-left">
            <Carousel 
              :value="getMusicHobby.photos" 
              :numVisible="1" 
              :numScroll="1" 
              :circular="true" 
              :autoplayInterval="5000"
              class="border-none shadow-none"
            >
              <template #item="slotProps">
                <div class="p-2">
                  <img :src="slotProps.data" alt="Music" class="w-full h-96 object-cover rounded-lg shadow-lg" />
                </div>
              </template>
            </Carousel>
          </div>
        </div>
      </div>
    </section>

    <!-- Fishing Section -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1" data-aos="fade-right">
            <Carousel 
              :value="getFishingHobby.photos" 
              :numVisible="1" 
              :numScroll="1" 
              :circular="true" 
              :autoplayInterval="5000"
              class="border-none shadow-none"
            >
              <template #item="slotProps">
                <div class="p-2">
                  <img :src="slotProps.data" alt="Fishing" class="w-full h-96 object-cover rounded-lg shadow-lg" />
                </div>
              </template>
            </Carousel>
          </div>
          
          <div class="order-1 lg:order-2" data-aos="fade-left">
            <h2 class="text-3xl font-bold mb-6">{{ getFishingHobby.title || t('hobbies.fishing.title') }}</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold mb-2">{{ t('hobbies.fishing.pike') }}</h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ getFishingHobby.description || t('hobbies.fishing.description') }}
                </p>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Equipment</h3>
                <ul class="space-y-2">
                  <li v-for="(item, index) in getFishingHobby.equipment" :key="index" class="flex items-center">
                    <i class="pi pi-check text-primary-600 dark:text-primary-400 mr-2"></i>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>