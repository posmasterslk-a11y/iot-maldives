<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { ref } from 'vue'

const open = ref(false)

const route = useRoute()

const navigation = [
  { label: 'Home', icon: 'i-lucide-home', to: '/dashboard' },
  { label: 'Fuel Stations', icon: 'i-lucide-droplets', to: '/stations' },
  { label: 'Fuel Usage Analytics', icon: 'i-lucide-bar-chart-2', to: '/analytics' },
  { label: 'Flow Meter Monitoring', icon: 'i-lucide-gauge', to: '/monitoring' },
  { label: 'Alarm Center', icon: 'i-lucide-bell', to: '/alarms', badge: '7' },
  { label: 'Maintenance', icon: 'i-lucide-wrench', to: '/maintenance' },
  { label: 'Tank Cleaning Schedule', icon: 'i-lucide-calendar', to: '/cleaning' },
  { label: 'Reports', icon: 'i-lucide-file-text', to: '/reports' },
]

const administration = [
  { label: 'Login Details', icon: 'i-lucide-log-in', to: '/login-details' },
  { label: 'User Management', icon: 'i-lucide-users', to: '/users' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '/settings' },
]
</script>

<template>
  <div class="flex h-screen bg-[#070b10] text-gray-300 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#0a1017] border-r border-[#1e2a3b] flex flex-col shrink-0">
      
      <!-- Logo Area -->
      <div class="p-6 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#162032] border border-[#233146] rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <span class="text-[#00d2ff] font-bold text-[10px]">TMA</span>
          </div>
          <div>
            <div class="text-[#00d2ff] font-bold tracking-widest text-sm leading-tight">TRANS MALDIVIAN</div>
            <div class="text-[#597393] text-[9px] font-semibold tracking-wider leading-tight mt-0.5">FUEL MONITORING<br>SYSTEM</div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="px-6 py-2">
        <div class="border border-green-500/30 bg-green-500/10 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <div class="flex items-center gap-2 text-green-400">
            <UIcon name="i-lucide-activity" class="w-4 h-4" />
            <span class="text-xs font-bold tracking-wider">SYSTEM ONLINE</span>
          </div>
          <div class="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <div class="text-[#4b607a] text-[10px] font-bold tracking-widest uppercase mb-3 px-2">Navigation</div>
        
        <nav class="space-y-1">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.label"
            :to="item.to"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group"
            :class="route.path === item.to ? 'bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20' : 'text-[#7e9bbd] hover:bg-[#162032] hover:text-white'"
          >
            <div class="flex items-center gap-3">
              <UIcon :name="item.icon" class="w-4 h-4" :class="route.path === item.to ? 'text-[#00d2ff]' : 'text-[#597393] group-hover:text-white'" />
              {{ item.label }}
            </div>
            <div v-if="item.badge" class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {{ item.badge }}
            </div>
          </NuxtLink>
        </nav>

        <div class="mt-6 mb-2 flex items-center justify-between px-2 cursor-pointer text-[#7e9bbd] hover:text-white transition-colors">
          <span class="text-sm font-medium">Supplier Management</span>
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
        </div>

        <div class="text-[#4b607a] text-[10px] font-bold tracking-widest uppercase mt-6 mb-3 px-2">Administration</div>
        <nav class="space-y-1">
          <NuxtLink 
            v-for="item in administration" 
            :key="item.label"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#7e9bbd] text-sm font-medium hover:bg-[#162032] hover:text-white transition-colors group"
          >
            <UIcon :name="item.icon" class="w-4 h-4 text-[#597393] group-hover:text-white" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t border-[#1e2a3b] mt-auto">
        <div class="flex items-center gap-3 cursor-pointer hover:bg-[#162032] p-2 rounded-lg transition-colors">
          <div class="w-8 h-8 rounded-full bg-[#00d2ff] text-[#070b10] flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(0,210,255,0.5)]">
            AM
          </div>
          <div>
            <div class="text-white text-xs font-bold">Admin User</div>
            <div class="text-[#597393] text-[10px] font-medium">System Administrator</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-screen overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<style>
/* Custom scrollbar for sidebar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e2a3b;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #2d4059;
}
</style>
