
<script setup>
import { ref, computed, onMounted } from 'vue'
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

// Utiliser directement les produits du store (déjà filtrés par l'API)
const filteredProducts = computed(() => {
  // Les produits sont déjà filtrés côté serveur, on applique juste le filtre prix localement
  // car l'API ne semble pas supporter le filtrage par prix
  let products = productsStore.getAllProducts
  
  // Filtre par prix (local car l'API ne le supporte pas)
  if (filters.value.priceRange) {
    products = products.filter(product =>
      product.price >= filters.value.priceRange.min &&
      product.price <= filters.value.priceRange.max
    )
  }
  
  // Filtre nouveautés (local)
  if (filters.value.newOnly) {
    products = products.filter(product => product.isNew)
  }
  
  return products
})

const handleFilters = async (newFilters) => {
  filters.value = { ...newFilters }
  
  // Recharger les produits avec les nouveaux filtres depuis l'API
  const params = {
    per_page: 15,
    page: 1 // Réinitialiser à la première page
  }
  
  if (newFilters.category) {
    const category = productsStore.categories.find(cat => cat.slug === newFilters.category)
    if (category) {
      params.category_id = category.id
    }
  } else {
    // Si pas de catégorie, ne pas envoyer category_id pour avoir tous les produits
    params.category_id = undefined
  }
  
  if (newFilters.search) {
    params.search = newFilters.search
  }
  
  await productsStore.fetchProducts(params)
}

onMounted(async () => {
  // Charger les catégories
  await productsStore.fetchCategories()
  
  // Charger les produits initiaux
  await productsStore.fetchProducts({
    per_page: 15,
    page: 1
  })
  
  // Déterminer le prix max depuis les produits
  if (productsStore.products.length > 0) {
    const maxPrice = Math.max(...productsStore.products.map(p => p.price))
    filters.value.priceRange.max = Math.ceil(maxPrice / 100) * 100 // Arrondir à la centaine supérieure
  }
})
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
  max-width: 100%;
}
</style>

