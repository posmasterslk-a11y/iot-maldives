<script setup lang="ts">
import { ref } from 'vue'

const supabase = useSupabaseClient()
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const updatePassword = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }
  
  if (newPassword.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters long.'
    return
  }

  loading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error

    successMsg.value = 'Your password has been updated successfully.'
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to update password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar title="Account Settings" />
    </template>

    <template #body>
      <UDashboardSection
        title="Security"
        description="Update your password to keep your account secure."
        orientation="horizontal"
      >
        <UDashboardCard
          title="Change Password"
          description="Enter a new strong password below."
          icon="i-lucide-shield"
        >
          <form @submit.prevent="updatePassword" class="space-y-6">
            <UFormGroup label="New Password" required>
              <UInput 
                v-model="newPassword" 
                type="password" 
                placeholder="••••••••" 
                icon="i-lucide-key" 
                size="md" 
              />
            </UFormGroup>
            
            <UFormGroup label="Confirm New Password" required>
              <UInput 
                v-model="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                icon="i-lucide-lock" 
                size="md" 
              />
            </UFormGroup>

            <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <UButton type="submit" color="primary" :loading="loading" size="md">
                Update Password
              </UButton>
            </div>

            <UAlert v-if="successMsg" color="green" variant="soft" icon="i-lucide-check-circle-2" :title="successMsg" class="mt-4" />
            <UAlert v-if="errorMsg" color="red" variant="soft" icon="i-lucide-alert-circle" :title="errorMsg" class="mt-4" />
          </form>
        </UDashboardCard>
      </UDashboardSection>
    </template>
  </UDashboardPanel>
</template>
