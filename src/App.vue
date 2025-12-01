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
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
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
