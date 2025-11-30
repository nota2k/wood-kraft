<template>
  <section class="product-banner">
    <div class="product-banner__image-wrapper">
      <img 
        :src="bannerImage" 
        :alt="title" 
        class="product-banner__image"
      />
    </div>
    <div class="product-banner__content">
      <h1 class="product-banner__title">{{ title }}</h1>
      <p v-if="subtitle" class="product-banner__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  bannerImage: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.product-banner {
  position: relative;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  margin-bottom: var(--padding-xs);
  background-color: var(--color-beige);
  
  &__image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
      z-index: 1;
    }
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: var(--padding-md);
  }
  
  &__title {
    font-family: 'Rokurou', serif;
    font-weight: 300;
    font-size: var(--font-hero);
    color: var(--color-marron-dark);
    margin: 0;
  }
  
  &__subtitle {
    font-family: 'Regarn', sans-serif;
    font-size: var(--font-lg);
    color: var(--color-beige);
    margin-top: var(--padding-xs);
    font-weight: 300;
  }
}
</style>

