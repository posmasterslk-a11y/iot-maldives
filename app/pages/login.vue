<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
    <UCard class="w-full max-w-md shadow-xl" :ui="{ body: { padding: 'p-6 sm:p-10' } }">
      <div class="text-center mb-8">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-6 shadow-inner">
          <UIcon name="i-lucide-droplet" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Trans Maldivian Airways <br/> IOT System Dashboard
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <UFormGroup label="Email Address">
          <UInput 
            v-model="email" 
            type="email" 
            autocomplete="email" 
            required 
            placeholder="admin@example.com" 
            icon="i-lucide-mail"
            size="lg"
            :ui="{ icon: { leading: { pointer: '' } } }"
          />
        </UFormGroup>
        
        <UFormGroup label="Password">
          <UInput 
            v-model="password" 
            type="password" 
            autocomplete="current-password" 
            required 
            placeholder="••••••••" 
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormGroup>

        <UButton 
          type="submit" 
          color="primary" 
          block 
          size="lg" 
          class="mt-8"
          :loading="loading"
        >
          Sign In
        </UButton>
        
        <UAlert 
          v-if="errorMsg" 
          color="red" 
          variant="soft" 
          icon="i-lucide-alert-circle" 
          :title="errorMsg" 
          class="mt-6" 
        />
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

definePageMeta({
  layout: 'empty'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// Automatically redirect when the user state is populated
watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    
    console.log('Login Response:', { data, error })
    
    if (error) {
      errorMsg.value = error.message
    }
    // Note: Redirection is handled by the watchEffect above
    // to ensure the user state has propagated to Nuxt Supabase before routing.
  } catch (err: any) {
    console.error('Login Exception:', err)
    errorMsg.value = err.message || 'An unexpected error occurred during login.'
  } finally {
    loading.value = false
  }
}
</script>
