<script setup>
import CardProduct from './CardProduct.vue'

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
      <CardProduct 
        v-for="product in products" 
        :key="product.id"
        :product="product"
      />
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
}
</style>
