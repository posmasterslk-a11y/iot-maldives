<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <UIcon name="i-heroicons-lock-closed" class="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Trans Maldivian Airways - IOT System Dashboard
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <UInput 
              id="email-address" 
              v-model="email" 
              type="email" 
              autocomplete="email" 
              required 
              placeholder="Email address" 
              icon="i-heroicons-envelope"
              size="lg"
            />
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <UInput 
              id="password" 
              v-model="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              placeholder="Password" 
              icon="i-heroicons-key"
              size="lg"
            />
          </div>
        </div>

        <div>
          <UButton 
            type="submit" 
            color="blue" 
            variant="solid" 
            block 
            size="lg" 
            :loading="loading"
          >
            Sign in
          </UButton>
        </div>
        
        <div v-if="errorMsg" class="text-sm text-red-500 text-center mt-2">
          {{ errorMsg }}
        </div>
      </form>
    </div>
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
