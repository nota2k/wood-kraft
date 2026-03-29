<script setup>
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import CardProduct from './CardProduct.vue'

defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

const productsStore = useProductsStore()

const pagination = computed(() => productsStore.pagination)

const handlePageChange = async (page) => {
  const params = {
    page,
    per_page: pagination.value.per_page
  }
  await productsStore.fetchProducts(params)
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
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
    
    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="product-listing__pagination">
      <button 
        @click="handlePageChange(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="product-listing__pagination-btn"
      >
        Précédent
      </button>
      
      <span class="product-listing__pagination-info">
        Page {{ pagination.current_page }} sur {{ pagination.last_page }}
      </span>
      
      <button 
        @click="handlePageChange(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="product-listing__pagination-btn"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-listing {
  padding: var(--padding-xs);
  background-color: var(--color-beige);
  width: 100%;
  
  &__container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid var(--color-marron-dark);

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__pagination {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--padding-sm);
    padding: var(--padding-md);
    margin-top: var(--padding-md);
  }
  
  &__pagination-btn {
    padding: var(--padding-xs) var(--padding-sm);
    font-size: var(--font-sm);
    color: var(--color-marron);
    background-color: transparent;
    border: var(--border);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color var(--transition);
    
    &:hover:not(:disabled) {
      background-color: var(--color-sable);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &__pagination-info {
    font-size: var(--font-sm);
    color: var(--color-marron);
    padding: 0 var(--padding-sm);
  }
}
</style>
