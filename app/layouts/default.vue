<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const open = ref(false)

const links = [[{
  label: 'Dashboard',
  icon: 'i-lucide-activity',
  to: '/dashboard',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Users',
  icon: 'i-lucide-users',
  to: '/users',
  onSelect: () => {
    open.value = false
  }
}]] satisfies NavigationMenuItem[][]

</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-2 py-3">
          <UIcon name="i-lucide-droplet" class="text-blue-500 w-8 h-8" />
          <span v-if="!collapsed" class="font-bold text-lg truncate">IOT Dashboard</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />

  </UDashboardGroup>
</template>
