import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

/**
 * Synchronise l’état client (localStorage) avec la session Laravel (cookie).
 * Sans ça, la navigation privée ou un stockage effacé laissait l’UI « déconnectée »
 * alors que le cookie de session était encore valide.
 */
export const useSessionStore = defineStore('session', () => {
  const hydrated = ref(false)

  async function hydrate() {
    try {
      const data = await api.getAuthUser()
      if (data?.user) {
        const u = data.user
        if (u.role === 'admin') {
          localStorage.setItem('admin_user', JSON.stringify(u))
          localStorage.removeItem('customer_user')
        } else {
          localStorage.setItem('customer_user', JSON.stringify(u))
          localStorage.removeItem('admin_user')
        }
        window.dispatchEvent(new Event('auth-changed'))
      } else {
        localStorage.removeItem('admin_user')
        localStorage.removeItem('customer_user')
      }
    } catch (e) {
      console.error('Session hydrate failed:', e)
    } finally {
      hydrated.value = true
    }
  }

  return { hydrated, hydrate }
})
