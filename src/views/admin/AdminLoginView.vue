<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-icon">W</span>
        <h1>Wood&Kraft</h1>
        <p>Administration</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="admin@woodkraft.fr"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const adminStore = useAdminStore()
const session = useSessionStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const res = await adminStore.login(form.value)
    session.setServerUser(res.user)
    router.push({ name: 'admin-dashboard' })
  } catch (e) {
    error.value = e.data?.message || 'Identifiants incorrects.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-beige);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(60, 58, 31, 0.1);
}

.login-brand {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--color-marron);
  color: white;
  border-radius: 14px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.login-brand h1 {
  font-size: 1.5rem;
  color: var(--color-dark);
  margin: 0 0 0.25rem;
}

.login-brand p {
  color: var(--color-marron-light);
  font-size: 0.875rem;
  margin: 0;
}

.login-form {
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
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-dark);
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-sable);
  border-radius: 10px;
  font-size: 1rem;
  color: var(--color-dark);
  background: var(--color-beige);
  transition: border-color 0.2s;
  outline: none;
}

.form-group input:focus {
  border-color: var(--color-marron);
}

.error-msg {
  color: #c0392b;
  font-size: 0.875rem;
  background: #fdf2f2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 0;
}

.btn-login {
  padding: 0.875rem;
  background-color: var(--color-marron);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 50px;
}

.btn-login:hover:not(:disabled) {
  background-color: var(--color-marron-dark);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
