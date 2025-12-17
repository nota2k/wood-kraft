<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { MoveRight } from 'lucide-vue-next'
import CardProduct from './CardProduct.vue'

const productsStore = useProductsStore()
const router = useRouter()

const products = computed(() => {
  return productsStore.getAllProducts.slice(0, 6)
})

const handleMoreClick = () => {
  router.push('/products')
}

onMounted(async () => {
  // Charger les produits si la liste est vide
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts({ per_page: 6 })
  }
})
</script>

<template>
  <section class="our-products">
    <div class="our-products__container">
      <h2 class="our-products__title">OUR PRODUCTS</h2>
      <div class="our-products__grid">
        <CardProduct 
          v-for="(product, index) in products" 
          :key="product.id"
          :product="product"
          :class="`our-products__item--${index + 1}`"
        />
      </div>
      <button class="our-products__button" @click="handleMoreClick">More <span class="our-products__button-icon"><MoveRight/></span></button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.our-products {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  display: flex;
  
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
    grid-template-rows: repeat(3, minmax(350px, 1fr));
    gap: 0;
    margin-bottom: 3rem;
    border: 1px solid var(--color-marron-dark);

    :deep(.card-product) {
      border: 1px solid var(--color-marron-dark);
      border-radius: 0;

      .card-product__image-wrapper {
        aspect-ratio: inherit;
      }
    }

    

    :deep(.card-product__info) {
      border-top: 1px solid var(--color-marron-dark);
    }

    :deep(.card-product__label-wrapper) {
      padding: var(--padding-sm) var(--padding-sm);
      border-right: 2px solid var(--color-marron-dark);
    }

    :deep(.card-product__price-wrapper) {
      padding: var(--padding-sm) var(--padding-xs);
    }
  }

  &__item--1 {
    grid-column: 1;
    grid-row: 1;
  }

  &__item--2 {
    grid-column: 2;
    grid-row: 1;
  }

  &__item--3 {
    grid-column: 3;
    grid-row: 1;
  }

  &__item--4 {
    grid-column: 1;
    grid-row: 2;
  }

  &__item--5 {
    grid-column: 2 / span 2;
    grid-row: 2 / span 2;
  }

  &__item--6 {
    grid-column: 1;
    grid-row: 3;
  }
  
  &__button {
    max-width: var(--large-button);
    margin: 0 auto;
    text-align: left;
    width: 100%;
  }
}
</style>

