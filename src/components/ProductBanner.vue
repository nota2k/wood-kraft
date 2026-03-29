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

const emit = defineEmits(['scroll-down'])
</script>

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
    <button class="product-banner__scroll-arrow" @click="emit('scroll-down')" aria-label="Voir les produits">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  </section>
</template>

<style scoped lang="scss">
.product-banner {
  position: relative;
  min-height: 80vh;
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

  &__scroll-arrow {
    position: absolute;
    bottom: var(--padding-md);
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--color-beige);
    opacity: 0.85;
    transition: opacity var(--transition);
    animation: bounce 1.8s ease-in-out infinite;

    svg {
      width: 48px;
      height: 48px;
      display: block;
    }

    &:hover {
      opacity: 1;
    }
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}
</style>
