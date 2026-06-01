<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
    <Sidebar />
    
    <div class="flex-1 flex flex-col md:ml-64 transition-all duration-300">
      <Navbar />
      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// If there's an API hit for checking user profile or auth validity, do it here.
onMounted(() => {
  authStore.initializeAuth()
})
</script>
