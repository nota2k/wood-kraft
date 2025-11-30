
<script setup>
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductBanner from '@/components/ProductBanner.vue'
import ProductListing from '@/components/ProductListing.vue'
import ProductFilters from '@/components/ProductFilters.vue'

// Import des images
import bannerImg from '@/assets/images/hero-banner.png'

const productsStore = useProductsStore()
const bannerImage = ref(bannerImg)

const filters = ref({
  category: '',
  priceRange: {
    min: 0,
    max: 5000
  },
  newOnly: false
})

const filteredProducts = computed(() => {
  return productsStore.filterProducts(filters.value)
})

const handleFilters = (newFilters) => {
  filters.value = { ...newFilters }
}
</script>

<template>
  <main class="products-view">
    <ProductBanner 
      title="OUR PRODUCTS"
      subtitle="Découvrez notre collection de meubles en bois"
      :banner-image="bannerImage"
    />
    <ProductFilters @update-filters="handleFilters" />
    <ProductListing :products="filteredProducts" />
  </main>
</template>


<style scoped lang="scss">
.products-view {
  background-color: var(--color-beige);
  min-height: 100vh;
}
</style>

