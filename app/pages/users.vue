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
    
    successMsg.value = 'User account provisioned successfully.'
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
      <UDashboardNavbar title="Settings" />
    </template>

    <template #body>
      <!-- Modern Split Layout -->
      <div class="flex flex-col lg:flex-row gap-8 pb-12">
        
        <!-- Left Side: Description -->
        <div class="lg:w-1/3">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <UIcon name="i-lucide-users" class="w-5 h-5 text-primary-500" />
            User Management
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Create and manage administrator accounts for the IoT Dashboard. Users created here will have immediate access to view and monitor all connected flow meters.
          </p>
          
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
              Security Note
            </h3>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
              Passwords must be at least 6 characters long. Ensure you provide users with their initial login credentials securely.
            </p>
          </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="lg:w-2/3">
          <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-4 sm:px-6' }, footer: { padding: 'p-4 sm:px-6' } }">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                  <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-base font-medium text-gray-900 dark:text-white">Provision New Account</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Enter the details below to create a new user.</p>
                </div>
              </div>
            </template>

            <form @submit.prevent="createUser" class="divide-y divide-gray-200 dark:divide-gray-800">
              <div class="p-4 sm:p-6 space-y-6">
                <UFormGroup label="Email Address" required>
                  <UInput v-model="email" type="email" placeholder="admin@example.com" size="lg" icon="i-lucide-mail" />
                </UFormGroup>
                
                <UFormGroup label="Password" required>
                  <UInput v-model="password" type="password" placeholder="••••••••" size="lg" icon="i-lucide-lock" />
                </UFormGroup>

                <UAlert v-if="successMsg" color="green" variant="soft" icon="i-lucide-check-circle-2" :title="successMsg" />
                <UAlert v-if="errorMsg" color="red" variant="soft" icon="i-lucide-alert-circle" :title="errorMsg" />
              </div>

              <div class="bg-gray-50 dark:bg-gray-800/50 p-4 sm:px-6 flex justify-end gap-3 rounded-b-lg">
                <UButton type="button" color="gray" variant="ghost" @click="email=''; password=''">
                  Cancel
                </UButton>
                <UButton type="submit" color="primary" :loading="loading" size="md">
                  Create Account
                </UButton>
              </div>
            </form>
          </UCard>
        </div>

      </div>
    </template>
  </UDashboardPanel>
</template>
