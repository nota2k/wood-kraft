<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { MoveRight } from 'lucide-vue-next'

const productsStore = useProductsStore()
const router = useRouter()

const products = computed(() => {
  return productsStore.getAllProducts.slice(0, 6)
})

const handleMoreClick = () => {
  router.push('/products')
}
</script>

<template>
  <section class="our-products">
    <div class="our-products__container">
      <h2 class="our-products__title">OUR PRODUCTS</h2>
      <div class="our-products__grid">
        <RouterLink 
          v-for="(product, index) in products" 
          :key="product.id"
          :to="`/product/${product.id}`"
          :class="['our-products__item', `our-products__item--${index + 1}`]"
        >
          <div class="our-products__image-wrapper">
            <img 
              :src="product.image || product.images[0]" 
              :alt="product.name" 
              class="our-products__image"
            />
          </div>
          <div class="our-products__info">
            <div class="our-products__label-wrapper">
              <p class="our-products__label">{{ product.name }}</p>
            </div>
            <div class="our-products__price-wrapper">
              <p class="our-products__price">{{ product.price }} €</p>
            </div>
          </div>
        </RouterLink>
      </div>
      <button class="our-products__button" @click="handleMoreClick">More <span class="our-products__button-icon"><MoveRight/></span></button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.our-products {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
  }
  
  &__title {
    font-family: 'Rokurou', sans-serif;
    font-weight: 300;
    font-size: var(--font-xl);
    color: var(--color-sable);
    margin-bottom: 4rem;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, minmax(450px, auto));
    gap: 0;
    margin-bottom: 3rem;
    border: var(--border);
  }
  
  &__item {
    display: grid;
    grid-template-rows: 1fr 110px;
    border: var(--border);
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: transform var(--transition), box-shadow var(--transition);
    background-color: var(--color-beige);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    // Position 1 : Top left
    &--1 {
      grid-column: 1;
      grid-row: 1;
    }

    // Position 2 : Top middle
    &--2 {
      grid-column: 2;
      grid-row: 1;
    }

    // Position 3 : Top right
    &--3 {
      grid-column: 3;
      grid-row: 1;
    }

    // Position 4 : Middle left
    &--4 {
      grid-column: 1;
      grid-row: 2;
    }

    // Position 5 : Middle right (GRAND - prend 2 lignes et 2 colonnes)
    &--5 {
      grid-column: 2 / span 2;
      grid-row: 2 / span 2;
    }

    // Position 6 : Bottom left
    &--6 {
      grid-column: 1;
      grid-row: 3;
    }
  }
  
  &__image-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f0f0f0;
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
    padding: var(--padding-sm) var(--padding-md);
    display: flex;
    align-items: center;
    flex-grow: 2;
    border-right: var(--border);
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
  }
  
  &__price-wrapper {
    padding: var(--padding-sm) var(--padding-md);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 130px;
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
  }
  
  &__button {
    max-width: var(--large-button);
    margin: 0 auto;
    text-align: left;
    width: 100%;
  }
}
</style>

