<template>
  <div class="account-layout">
    <!-- Sidebar fixe à gauche -->
    <aside class="account-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Mon Compte</h2>
      </div>

      <nav class="sidebar-nav">
        <RouterLink :to="{ name: 'account-dashboard' }" class="nav-item">
          <LayoutDashboard :size="20" />
          Tableau de bord
        </RouterLink>
        <RouterLink :to="{ name: 'account-orders' }" class="nav-item">
          <ShoppingBag :size="20" />
          Mes commandes
        </RouterLink>
        <RouterLink :to="{ name: 'account-profile' }" class="nav-item">
          <User :size="20" />
          Mon profil
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <LogOut :size="20" />
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Contenu variable à droite -->
    <main class="account-content">
      <header class="content-header">
        <RouterLink to="/" class="back-shop">
          <span class="icon">«</span> Retour à la boutique
        </RouterLink>
      </header>
      
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LayoutDashboard, ShoppingBag, User, LogOut } from 'lucide-vue-next'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const session = useSessionStore()

async function handleLogout() {
  try {
    await api.post('/auth/logout')
    localStorage.removeItem('customer_user')
    session.setServerUser(null)
    const cartStore = useCartStore()
    cartStore.clearCart() // Réinitialise le panier localement (et distant via sync si on voulait, mais ici on est déconnecté)
    window.dispatchEvent(new Event('auth-changed'))
    router.push('/')
  } catch (err) {
    // Si déjà expiré, on vide juste le localstorage et on redirige
    localStorage.removeItem('customer_user')
    session.setServerUser(null)
    const cartStore = useCartStore()
    cartStore.clearCart()
    window.dispatchEvent(new Event('auth-changed'))
    router.push('/')
  }
}
</script>

<style scoped>
.account-layout {
  display: flex;
  min-height: 100vh;
  background: #fbfaf8;
}

.account-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid var(--color-sable);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 3rem 2rem 2rem;
}

.sidebar-title {
  font-family: 'Rokurou', serif;
  font-size: 1.5rem;
  color: var(--color-marron);
  letter-spacing: -0.02em;
}

.sidebar-nav {
  padding: 0 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: var(--color-sable);
  color: var(--color-dark);
}

.nav-item.router-link-active {
  background: var(--color-marron);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 39, 28, 0.2);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-sable);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fee2e2;
  transform: translateY(-2px);
}

.account-content {
  flex: 1;
  margin-left: 280px; /* Offset for fixed sidebar */
  padding: 2rem 4rem;
}

.content-header {
  margin-bottom: 3rem;
  display: flex;
  justify-content: flex-end;
}

.back-shop {
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-shop:hover {
  color: var(--color-marron);
}

@media (max-width: 1024px) {
  .account-sidebar {
    width: 220px;
  }
  .account-content {
    margin-left: 220px;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .account-layout {
    flex-direction: column;
  }
  .account-sidebar {
    position: static;
    width: 100%;
    order: 2;
  }
  .account-content {
    margin-left: 0;
    order: 1;
  }
}
</style>
