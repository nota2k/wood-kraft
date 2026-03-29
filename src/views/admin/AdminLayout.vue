<template>
  <div class="admin-layout">

    <!-- Overlay mobile -->
    <Transition name="overlay">
      <div v-if="mobileOpen" class="sidebar-overlay" @click="mobileOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{
      'desktop-collapsed': desktopCollapsed,
      'mobile-open': mobileOpen
    }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="brand-icon">W</span>
          <span class="brand-name">Wood&Kraft</span>
        </div>
        <button class="collapse-btn" @click="desktopCollapsed = !desktopCollapsed" title="Réduire">
          <ChevronLeft v-if="!desktopCollapsed" :size="18" />
          <ChevronRight v-else :size="18" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="nav-item" active-class="active"
          @click="mobileOpen = false">
          <LayoutDashboard :size="20" />
          <span class="nav-label">Tableau de bord</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-products' }" class="nav-item" active-class="active" @click="mobileOpen = false">
          <Package :size="20" />
          <span class="nav-label">Produits</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-categories' }" class="nav-item" active-class="active"
          @click="mobileOpen = false">
          <Tag :size="20" />
          <span class="nav-label">Catégories</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-orders' }" class="nav-item" active-class="active"
          @click="mobileOpen = false">
          <ShoppingBag :size="20" />
          <span class="nav-label">Commandes</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-details">
            <span class="user-name">{{ adminStore.user?.name || 'Admin' }}</span>
            <span class="user-role">Administrateur</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="Se déconnecter">
          <LogOut :size="18" />
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="main-wrapper">
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import {
  LayoutDashboard, Package, Tag, LogOut,
  ChevronLeft, ChevronRight, Menu, X, ExternalLink, ShoppingBag
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const desktopCollapsed = ref(false)
const mobileOpen = ref(false)

const userInitials = computed(() => {
  const name = adminStore.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const currentProductLink = computed(() => {
  if (route.name === 'admin-product-edit' && route.params.id) {
    return { name: 'product', params: { id: route.params.id } }
  }
  return '/'
})

const currentProductLabel = computed(() => {
  return (route.name === 'admin-product-edit' && route.params.id) ? 'Voir le produit' : 'Voir le site'
})

async function handleLogout() {
  await adminStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f7f2;
  font-family: inherit;
  max-width: 100%;
}

/* ── OVERLAY MOBILE ── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 99;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.28s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* ── SIDEBAR ── */
.sidebar {
  width: 260px;
  background: var(--color-dark);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s ease;
  overflow: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar.desktop-collapsed {
  width: 72px;
}

/* Éléments qui disparaissent quand collapsed desktop */
.brand-name,
.nav-label,
.user-details {
  transition: opacity 0.2s ease, width 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.desktop-collapsed .brand-name,
.sidebar.desktop-collapsed .nav-label,
.sidebar.desktop-collapsed .user-details {
  opacity: 0;
  width: 0;
}

/* ── HEADER SIDEBAR ── */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 72px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-marron);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.brand-name {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.collapse-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: white;
}

/* ── NAV ── */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.active {
  background: var(--color-marron);
  color: white;
}

/* ── FOOTER SIDEBAR ── */
.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  overflow: hidden;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-marron);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name {
  display: block;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  display: block;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.logout-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  flex-shrink: 0;
  transition: color 0.2s, background 0.2s;
}

.logout-btn:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

/* ── MAIN ── */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-dark);
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.mobile-menu-btn:hover {
  background: var(--color-sable);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.view-site-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-marron);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.875rem;
  border: 1.5px solid var(--color-marron);
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.view-site-link:hover {
  background: var(--color-marron);
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-x: auto;
}

/* ── MOBILE ── */
@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }

  .mobile-menu-btn {
    display: flex;
  }

  /* Sur mobile, la sidebar sort depuis la gauche */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* On ignore le collapse desktop sur mobile */
  .sidebar.desktop-collapsed {
    width: 260px;
    transform: translateX(-100%);
  }

  .sidebar.mobile-open,
  .sidebar.desktop-collapsed.mobile-open {
    transform: translateX(0);
  }

  /* Rétablir les labels cachés par le collapse desktop */
  .sidebar.desktop-collapsed .brand-name,
  .sidebar.desktop-collapsed .nav-label,
  .sidebar.desktop-collapsed .user-details {
    opacity: 1;
    width: auto;
  }

  /* Cacher le bouton collapse (inutile sur mobile) */
  .collapse-btn {
    display: none;
  }

  .main-content {
    padding: 1.25rem;
  }
}
</style>
