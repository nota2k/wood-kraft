<template>
  <div class="app">
    <Header />
    <main class="app__main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { initSmoothScroll, destroySmoothScroll, getLenis } from './composables/useSmoothScroll'
import { useCartStore } from './stores/cart'
import { useSessionStore } from './stores/session'

function syncServerUserAfterAuthEvent() {
  const session = useSessionStore()
  const raw = localStorage.getItem('customer_user') || localStorage.getItem('admin_user')
  if (!raw) {
    session.setServerUser(null)
  }
}

onMounted(() => {
  initSmoothScroll()
  window.addEventListener('auth-changed', syncServerUserAfterAuthEvent)

  const cartStore = useCartStore()
  const session = useSessionStore()
  // Panier distant seulement si la session est confirmée par le serveur (évite GET /customer/cart 401 au chargement)
  if (session.serverUser) {
    cartStore.loadCart()
  }
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', syncServerUserAfterAuthEvent)
  destroySmoothScroll()
})

// Scroll en haut à chaque changement de route
const route = useRoute()
watch(
  () => route.path,
  () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }
)
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Regarn', sans-serif;
  background-color: var(--color-beige);
  color: var(--color-marron);
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1;
  padding-top: 90px; // Compensate for fixed header
}
</style>
