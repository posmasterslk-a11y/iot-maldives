<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: user.value?.email || 'Admin User',
  icon: 'i-lucide-user'
}], [{
  label: 'Appearance',
  icon: 'i-lucide-sun-moon',
  children: [{
    label: 'Light',
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()
      colorMode.preference = 'light'
    }
  }, {
    label: 'Dark',
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}], [{
  label: 'Log out',
  icon: 'i-lucide-log-out',
  onSelect: handleLogout
}]]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      icon="i-lucide-user-circle"
      :label="collapsed ? undefined : user?.email || 'Admin'"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
