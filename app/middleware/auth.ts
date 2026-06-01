import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (process.client) {
    authStore.initializeAuth()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
