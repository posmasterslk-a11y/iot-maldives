<template>
  <div class="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <UIcon name="i-heroicons-globe-alt" class="h-6 w-6" />
            <span>TMA IOT Panel</span>
          </div>
        </div>
        <div class="flex-1 flex flex-col overflow-y-auto">
          <nav class="flex-1 px-2 py-4 space-y-1">
            <NuxtLink 
              to="/dashboard" 
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
            >
              <UIcon name="i-heroicons-home" class="mr-3 flex-shrink-0 h-6 w-6 text-gray-500" />
              Dashboard
            </NuxtLink>
            <!-- Future links can go here -->
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top header -->
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
          <div class="flex-1 flex items-center">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">IOT System Dashboard</h1>
          </div>
          <div class="ml-4 flex items-center md:ml-6 space-x-4">
            
            <!-- Dark mode toggle -->
            <UButton 
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" 
              color="gray" 
              variant="ghost" 
              @click="isDark = !isDark" 
            />

            <!-- User Menu -->
            <UDropdown :items="userMenuItems" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-end' }">
              <UAvatar :alt="userEmail ? userEmail.charAt(0).toUpperCase() : 'U'" size="sm" class="cursor-pointer" />
              
              <template #account="{ item }">
                <div class="text-left">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ userEmail }}
                  </p>
                </div>
              </template>
            </UDropdown>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userEmail = computed(() => user.value?.email || 'User')

const handleLogout = async () => {
  await supabase.auth.signOut()
  const router = useRouter()
  router.push('/login')
}

const userMenuItems = [
  [{
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: handleLogout
  }]
]
</script>
