import { defineStore } from 'pinia'
import { authService } from '../services/auth'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie('auth_token').value || null as string | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'Admin'
  },

  actions: {
    async login(username: string, password: string, rememberMe: boolean = false) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(username, password)
        this.token = response.token
        this.user = response.user
        
        const cookie = useCookie('auth_token', { 
          maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined, // 30 days or session
          watch: true 
        })
        cookie.value = response.token
        
        if (process.client) {
          localStorage.setItem('auth_user', JSON.stringify(response.user))
        }
        
        return true
      } catch (e: any) {
        this.error = e.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await authService.logout()
      this.token = null
      this.user = null
      
      const cookie = useCookie('auth_token')
      cookie.value = null
      
      if (process.client) {
        localStorage.removeItem('auth_user')
      }
    },

    initializeAuth() {
      if (process.client) {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser)
          } catch (e) {
            console.error('Failed to parse user from localStorage')
          }
        }
      }
    }
  }
})
