<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <h1 class="brand-title">Wood&Kraft</h1>
        <p class="brand-subtitle">{{ isRegister ? 'Créez votre compte client' : 'Connectez-vous à votre espace' }}</p>
      </div>

      <div class="auth-tabs">
        <button class="tab-btn" :class="{ active: !isRegister }" @click="isRegister = false">Connexion</button>
        <button class="tab-btn" :class="{ active: isRegister }" @click="isRegister = true">Création</button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="isRegister" class="form-group">
          <label>Nom complet</label>
          <input v-model="form.name" type="text" placeholder="Jean Dupont" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="votre@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label>Confirmer le mot de passe</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ isRegister ? 'Créer mon compte' : 'Se connecter' }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <RouterLink to="/" class="back-link">
          <ArrowLeft :size="16" />
          Retour à la boutique
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useSessionStore } from '@/stores/session'
import api from '@/services/api'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const session = useSessionStore()
const isRegister = ref(false)
const loading = ref(false)
const error = ref(null)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    await (isRegister.value 
      ? await api.register(form)
      : await api.login(form))

    // Vérifie que la session Laravel est réellement persistée (cookie + auth serveur)
    await session.hydrate()
    if (!session.serverUser) {
      throw new Error('SESSION_NOT_PERSISTED')
    }

    // Navigation d’abord : le garde-fou router lit localStorage ; loadCart après (évite 401 panier → redirection forcée)
    await router.push({ name: 'account-dashboard' })

    const cartStore = useCartStore()
    await cartStore.loadCart()
  } catch (err) {
    session.setServerUser(null)
    localStorage.removeItem('customer_user')
    localStorage.removeItem('admin_user')
    window.dispatchEvent(new Event('auth-changed'))
    if (err?.message === 'SESSION_NOT_PERSISTED') {
      error.value = 'Connexion incomplète: session non reconnue par le serveur. Réessayez.'
    } else {
      error.value = err.data?.message || 'Identifiants incorrects.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-sable);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-title {
  font-family: 'Rokurou', serif;
  font-size: 2.5rem;
  color: var(--color-marron);
  margin-bottom: 0.5rem;
}

.brand-subtitle {
  color: #666;
  font-size: 0.95rem;
}

.auth-tabs {
  display: flex;
  background: #f5f5f5;
  padding: 0.35rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: var(--color-dark);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-dark);
}

.form-group input {
  padding: 0.875rem;
  border-radius: 10px;
  border: 1.5px solid #eee;
  outline: none;
  transition: border-color 0.2s;
  font-size: 0.95rem;
}

.form-group input:focus {
  border-color: var(--color-marron);
}

.submit-btn {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  background: var(--color-marron);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #472d24;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
}

.auth-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-marron);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: rotate 0.8s linear infinite;
  display: inline-block;
}

@keyframes rotate { to { transform: rotate(360deg); } }
</style>
