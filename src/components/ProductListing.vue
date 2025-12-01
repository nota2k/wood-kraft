<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<template>
  <div class="product-listing">
    <div class="product-listing__container">
        <RouterLink 
          v-for="product in products" 
          :key="product.id"
          :to="`/product/${product.id}`"
          class="product-listing__item"
        >
          <div class="product-listing__image-wrapper">
            <img 
              :src="product.image || product.images[0]" 
              :alt="product.name" 
              class="product-listing__image"
            />
          </div>
          <div class="product-listing__info">
            <div class="product-listing__label-wrapper">
              <p class="product-listing__label">{{ product.name }}</p>
            </div>
            <div class="product-listing__price-wrapper">
              <p class="product-listing__price">{{ product.price }} €</p>
            </div>
          </div>
        </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-listing {
  padding: var(--padding-xs) var(--padding-xs);
  background-color: var(--color-beige);
  display: grid;
  max-width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: var(--padding-md);
  }
  
  &__item {
    display: grid;
    grid-template-rows: auto 110px;
    outline: var(--border);
    background-color: var(--color-beige);
    transition: transform var(--transition), box-shadow var(--transition);
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  
  &__image-wrapper {
    width: 100%;
    aspect-ratio: 4/4;
    overflow: hidden;
    position: relative;
    outline: var(--border);
    background-color: #f0f0f0;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: var(--color-marron);
      transition: opacity var(--transition);
      mix-blend-mode: color;
      pointer-events: none;
    }

    &:hover::after {
      opacity: 1;
    }
  }

  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border-top: var(--border);
  }
  
  &__label-wrapper {
    padding: var(--padding-xs) var(--padding-sm);
    display: flex;
    align-items: center;
    flex-grow: 2;
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
    border-right: var(--border);
  }
  
  &__label {
    margin: 0;
  }
  
  &__price-wrapper {
    padding: var(--padding-xs) var(--padding-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 130px;
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
  }
  
  &__price {
    margin: 0;
  }
}
</style>
