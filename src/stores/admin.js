import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAdminStore = defineStore('admin', () => {
  // Le backend utilise les sessions (cookies), pas des tokens JWT.
  // On stocke uniquement les infos utilisateur en localStorage comme indicateur de session.
  const user = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))

  const isAuthenticated = computed(() => !!user.value)

  async function login(credentials) {
    const response = await api.login(credentials)
    user.value = response.user
    localStorage.setItem('admin_user', JSON.stringify(response.user))
    return response
  }

  async function logout() {
    try {
      await api.logout()
    } catch {
      // ignore
    }
    user.value = null
    localStorage.removeItem('admin_user')
  }

  async function checkAuth() {
    try {
      const response = await api.getMe()
      user.value = response.user
      localStorage.setItem('admin_user', JSON.stringify(response.user))
      return true
    } catch {
      user.value = null
      localStorage.removeItem('admin_user')
      return false
    }
  }

  return { user, isAuthenticated, login, logout, checkAuth }
})
