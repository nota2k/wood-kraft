<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { MoveRight } from 'lucide-vue-next'
import CardProduct from './CardProduct.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const productsStore = useProductsStore()
const router = useRouter()
const titleRef = ref(null)
const gridRef = ref(null)
const buttonRef = ref(null)
const { revealFrom, revealStagger } = useScrollReveal()

const products = computed(() => {
  return productsStore.getAllProducts.slice(0, 6)
})

const handleMoreClick = () => {
  router.push('/products')
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts({ per_page: 6 })
  }

  revealFrom(titleRef.value, { y: 40 })
  revealStagger(gridRef.value?.querySelectorAll('.card-product'), {}, { trigger: gridRef.value, start: 'top 80%' })
  revealFrom(buttonRef.value, { y: 20 }, { start: 'top 90%' })
})
</script>

<template>
  <section class="our-products">
    <div class="our-products__container">
      <h2 ref="titleRef" class="our-products__title">OUR PRODUCTS</h2>
      <div ref="gridRef" class="our-products__grid">
        <CardProduct v-for="(product, index) in products" :key="product.id" :product="product"
          :class="`our-products__item--${index + 1}`" />
      </div>
      <button class="our-products__button more" @click="handleMoreClick">More <svg xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right">
          <circle cx="12" cy="12" r="10" />
          <path d="m12 16 4-4-4-4" />
          <path d="M8 12h8" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.our-products {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  grid-column: 1 / -1; // span toute la largeur de la grille parente
  display: flex;
  flex-direction: column;

  &__container {
    width: 100%;
  }

  &__title {
    font-family: 'Rokurou', sans-serif;
    font-weight: 300;
    font-size: var(--font-xl);
    color: var(--color-sable);
    margin-bottom: var(--spacing-md);
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(350px, auto);
    gap: 0;
    align-content: start;
    margin-bottom: var(--spacing-md);
    // border: 1px solid var(--color-marron-dark);
    width: 100%;
    // overflow: hidden;

    :deep(.card-product) {
      border: 1px solid var(--color-marron-dark);
      border-radius: 0;
      transform: translate(0px, 0px) !important;

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

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      // grid-template-rows: none;
      // grid-auto-rows: minmax(250px, auto);

      :deep(.card-product .card-product__image-wrapper) {
        aspect-ratio: 3 / 4;
      }
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
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

  @media (max-width: 768px) {
    padding: 3rem 1rem;

    &__item--1,
    &__item--2,
    &__item--3,
    &__item--4,
    &__item--5,
    &__item--6 {
      grid-column: auto;
      grid-row: auto;
    }
  }

  &__button {
    max-width: var(--large-button);
    margin: 0 auto;
    text-align: left;
    width: 100%;
  }
}
</style>
