import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

/**
 * Synchronise l’état client (localStorage) avec la session Laravel (cookie).
 * Sans ça, la navigation privée ou un stockage effacé laissait l’UI « déconnectée »
 * alors que le cookie de session était encore valide.
 *
 * `serverUser` : utilisateur confirmé par GET /auth/user (évite d’appeler le panier
 * avec seulement un vieux `customer_user` en localStorage → 401).
 */
export const useSessionStore = defineStore('session', () => {
  const hydrated = ref(false)
  /** @type {import('vue').Ref<object|null>} */
  const serverUser = ref(null)

  function setServerUser(user) {
    serverUser.value = user ?? null
  }

  async function hydrate() {
    try {
      const data = await api.getAuthUser()
      serverUser.value = data?.user ?? null
      if (data?.user) {
        const u = data.user
        const adminRole = String(u.role ?? '').toLowerCase() === 'admin'
        if (adminRole) {
          localStorage.setItem('admin_user', JSON.stringify(u))
          localStorage.removeItem('customer_user')
        } else {
          localStorage.setItem('customer_user', JSON.stringify(u))
          localStorage.removeItem('admin_user')
        }
        window.dispatchEvent(new Event('auth-changed'))
      } else {
        // Évite un état "faux connecté" (localStorage ancien, session serveur absente)
        const hadAuth =
          !!localStorage.getItem('customer_user') || !!localStorage.getItem('admin_user')
        localStorage.removeItem('customer_user')
        localStorage.removeItem('admin_user')
        if (hadAuth) {
          window.dispatchEvent(new Event('auth-changed'))
        }
      }
    } catch (e) {
      console.error('Session hydrate failed:', e)
      serverUser.value = null
      localStorage.removeItem('customer_user')
      localStorage.removeItem('admin_user')
      window.dispatchEvent(new Event('auth-changed'))
    } finally {
      hydrated.value = true
    }
  }

  return { hydrated, hydrate, serverUser, setServerUser }
})
