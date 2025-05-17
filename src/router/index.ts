import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { 
      title: 'Home',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    // @ts-ignore
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/Projects.vue'),
    meta: {
      title: 'Projects',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('../views/ProjectDetail.vue'),
    meta: {
      title: 'Project Detail',
      transitionName: 'fade'
    }
  },
  {
    path: '/technologies',
    name: 'technologies',
    component: () => import('../views/Technologies.vue'),
    meta: {
      title: 'Technologies',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/experience',
    name: 'experience',
    component: () => import('../views/Experience.vue'),
    meta: {
      title: 'Experience',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/experience/:id',
    name: 'experience-detail',
    component: () => import('../views/ExperienceDetail.vue'),
    meta: {
      title: 'Experience Detail',
      transitionName: 'fade'
    }
  },
  {
    path: '/hobbies',
    name: 'hobbies',
    component: () => import('../views/Hobbies.vue'),
    meta: {
      title: 'Hobbies',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      title: 'Contact',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('../views/Resume.vue'),
    meta: {
      title: 'Resume',
      transitionName: 'slide-left'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 Not Found',
      transitionName: 'fade'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.user) {
      next('/')
      return
    }
    
    if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.isAdmin) {
      next('/')
      return
    }
  }
  
  next()
})

export default router