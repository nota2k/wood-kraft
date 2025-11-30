<template>
  <Header />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
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
</style>
