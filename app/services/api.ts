import axios from 'axios'
import { generateSignature } from '../utils/crypto'

export const api = axios.create({
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  // Use hardcoded values or public env variables to ensure it works on client-side
  const appId = 'fOesUorUnKORXx2S'
  const appSecret = 'WKrE9DRD0WYZ2UHZvYVSndw34IV6z5Vc'
  const timestamp = Math.floor(Date.now() / 1000).toString()
  
  // Use the direct URL since the proxy is failing on the VM network
  config.baseURL = 'https://yunyi.oneyibiao.com/api/v1'
  
  config.headers['x-auth-appid'] = appId
  config.headers['x-auth-timestamp'] = timestamp
  config.headers['x-auth-sign'] = generateSignature(appId, timestamp, appSecret)
  
  // Also include JWT token for internal auth
  const token = useCookie('auth_token').value
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Handle unauthorized
      const token = useCookie('auth_token')
      token.value = null
      if (process.client) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
