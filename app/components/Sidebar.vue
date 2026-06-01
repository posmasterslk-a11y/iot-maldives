<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform transform md:translate-x-0"
    :class="{ '-translate-x-full': !dashboardStore.sidebarOpen, 'translate-x-0': dashboardStore.sidebarOpen }"
  >
    <div class="flex items-center justify-center h-16 border-b border-gray-800">
      <span class="text-xl font-semibold uppercase">IoT Admin</span>
    </div>
    <nav class="p-4 space-y-2">
      <NuxtLink
        to="/dashboard"
        class="flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
        active-class="bg-gray-800 text-white font-medium"
      >
        <UIcon name="i-heroicons-home" class="mr-3 w-5 h-5" />
        Dashboard
      </NuxtLink>
      <NuxtLink
        to="/devices"
        class="flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
        active-class="bg-gray-800 text-white font-medium"
      >
        <UIcon name="i-heroicons-cpu-chip" class="mr-3 w-5 h-5" />
        Devices
      </NuxtLink>
    </nav>
  </aside>

  <!-- Mobile overlay -->
  <div
    v-if="dashboardStore.sidebarOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
    @click="dashboardStore.toggleSidebar"
  ></div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard'

const dashboardStore = useDashboardStore()
</script>
