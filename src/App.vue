<template>
  <div class="app">
    <PageLoader :is-loading="isLoading" />
    <Header />
    <main class="app__main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import PageLoader from './components/PageLoader.vue'

const route = useRoute()
const isLoading = ref(false)

watch(
    () => route.path,
    () => {
        isLoading.value = true
        // Réinitialiser la position instantanément
        window.scrollTo(0, 0)
        
        // Masquer le loader après un court délai
        setTimeout(() => {
            isLoading.value = false
        }, 300)
    },
    { immediate: false }
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
