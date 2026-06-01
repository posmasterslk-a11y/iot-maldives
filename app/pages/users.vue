<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const createUser = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const res = await $fetch('/api/users/create', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    successMsg.value = 'User created successfully! They can now log in.'
    email.value = ''
    password.value = ''
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || 'Failed to create user'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar title="User Management" />
    </template>

    <template #body>
      <UDashboardCard
        title="Create New User"
        description="Add a new administrator to access the dashboard."
        icon="i-lucide-user-plus"
        class="max-w-xl mx-auto mt-8"
      >
        <form @submit.prevent="createUser" class="space-y-4">
          <UFormGroup label="Email Address">
            <UInput v-model="email" type="email" placeholder="admin@example.com" required icon="i-lucide-mail" />
          </UFormGroup>
          
          <UFormGroup label="Password">
            <UInput v-model="password" type="password" placeholder="Min 6 characters" required icon="i-lucide-lock" />
          </UFormGroup>

          <UButton type="submit" color="blue" :loading="loading" block>
            Create User Account
          </UButton>

          <UAlert v-if="successMsg" color="green" variant="subtle" icon="i-lucide-check-circle" :title="successMsg" class="mt-4" />
          <UAlert v-if="errorMsg" color="red" variant="subtle" icon="i-lucide-alert-circle" :title="errorMsg" class="mt-4" />
        </form>
      </UDashboardCard>
    </template>
  </UDashboardPanel>
</template>
