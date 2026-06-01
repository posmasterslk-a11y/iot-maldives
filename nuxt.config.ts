// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm']
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: '/api/proxy',
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET
    }
  },
  routeRules: {
    '/api/proxy/**': { proxy: 'https://yunyi.oneyibiao.com/api/v1/**' }
  },
  build: {
    transpile: ['papaparse']
  },
  future: {
    compatibilityVersion: 4
  }
})