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
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
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
    font-family: 'Lovan', serif;
    font-size: var(--font-xxl);
    color: var(--color-beige);
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  &__subtitle {
    font-family: 'Regarn', sans-serif;
    font-size: var(--font-lg);
    color: var(--color-beige);
    margin-top: var(--padding-xs);
    font-weight: 300;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
}
</style>

