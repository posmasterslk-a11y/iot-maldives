import api from './api'
import type { AuthResponse } from '../types'

export const authService = {
  login(username: string, password: string): Promise<AuthResponse> {
    // In a real app, this would hit the API. 
    // For this demonstration with the external API, we simulate internal auth.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          resolve({
            token: 'mock-jwt-token-admin',
            user: { id: 1, username: 'admin', role: 'Admin' }
          })
        } else if (username === 'viewer' && password === 'viewer') {
          resolve({
            token: 'mock-jwt-token-viewer',
            user: { id: 2, username: 'viewer', role: 'Viewer' }
          })
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 800)
    })
  },
  
  logout() {
    return Promise.resolve()
  }
}
