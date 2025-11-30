<template>
  <main class="products-view">
    <ProductBanner 
      title="OUR PRODUCTS"
      subtitle="Découvrez notre collection de meubles en bois"
      :banner-image="bannerImage"
    />
    <ProductListing :products="products" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import ProductBanner from '@/components/ProductBanner.vue'
import ProductListing from '@/components/ProductListing.vue'

// Import des images
import bannerImg from '@/assets/images/hero-banner.png'
import productImage01 from '@/assets/images/home-ourproducts-01.png'
import productImage02 from '@/assets/images/home-ourproducts-02.png'
import productImage03 from '@/assets/images/home-ourproducts-03.png'
import productImage04 from '@/assets/images/home-ourproducts-04.png'
import productImage05 from '@/assets/images/home-ourproducts-05.png'

const bannerImage = ref(bannerImg)

const products = ref([
  {
    name: 'Tables hexagonales',
    image: productImage01,
    price: '--'
  },
  {
    name: 'Table d\'appoint',
    image: productImage02,
    price: '--'
  },
  {
    name: 'Armoire',
    image: productImage03,
    price: '--'
  },
  {
    name: 'Étagère moderne',
    image: productImage04,
    price: '--'
  },
  {
    name: 'Meuble de rangement',
    image: productImage05,
    price: '--'
  },
  {
    name: 'Table basse',
    image: productImage01,
    price: '--'
  },
  {
    name: 'Chaise design',
    image: productImage02,
    price: '--'
  },
  {
    name: 'Bureau en bois',
    image: productImage03,
    price: '--'
  }
])
</script>

<style scoped lang="scss">
.products-view {
  background-color: var(--color-beige);
  min-height: 100vh;
}
</style>

