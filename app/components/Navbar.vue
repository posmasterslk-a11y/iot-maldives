<template>
  <header class="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-30">
    <div class="flex items-center">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-bars-3"
        class="md:hidden mr-2"
        @click="dashboardStore.toggleSidebar"
      />
      <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
        {{ route.name?.toString().toUpperCase() || 'DASHBOARD' }}
      </h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Dark mode toggle -->
      <UButton
        :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
        color="gray"
        variant="ghost"
        @click="isDark = !isDark"
      />

      <!-- User dropdown -->
      <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
        <UButton color="gray" variant="ghost" class="flex items-center space-x-2">
          <UAvatar :alt="authStore.user?.username || 'User'" size="sm" />
          <span class="hidden md:inline-block text-sm font-medium">{{ authStore.user?.username }}</span>
        </UButton>
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const userMenuItems = [
  [{
    label: authStore.user?.username || 'Profile',
    avatar: {
      src: authStore.user?.avatar
    }
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth'
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: handleLogout
  }]
]
</script>
