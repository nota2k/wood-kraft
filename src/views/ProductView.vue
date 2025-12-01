<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductSuggestions from '@/components/ProductSuggestions.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const selectedColor = ref(null)

const product = computed(() => {
  const id = route.params.id
  return productsStore.getProductById(id)
})

onMounted(() => {
  if (!product.value) {
    // Si le produit n'existe pas, rediriger vers la page produits
    router.push('/products')
    return
  }
  
  if (product.value.colorVariations && product.value.colorVariations.length > 0) {
    selectedColor.value = product.value.colorVariations[0]
  }
})

const handleColorSelect = (color) => {
  selectedColor.value = color
}

const getCategoryLabel = (category) => {
  const labels = {
    'tables': 'Tables',
    'chairs': 'Chaises',
    'storage': 'Rangements',
    'shelves': 'Étagères',
    'decorative': 'Décoratif'
  }
  return labels[category] || category
}

const breadcrumbItems = computed(() => {
  if (!product.value) return []
  
  return [
    { label: 'Produits', to: '/products' },
    { label: product.value.name }
  ]
})

const handleAddToCart = () => {
  if (!product.value) return
  
  cartStore.addItem(product.value.id, selectedColor.value, 1)
}
</script>

<template>
  <main class="product-view">
    <Breadcrumb :items="breadcrumbItems" />
    <div class="product-view__container">
      <!-- Images produit -->
      <div class="product-view__gallery" v-if="product">
        <div 
          v-for="(image, index) in product.images" 
          :key="index"
          class="product-view__image-item"
        >
          <img :src="image" :alt="`${product.name} - vue ${index + 1}`" />
        </div>
      </div>

      <!-- Informations produit -->
      <div class="product-view__info" v-if="product">
        <h1 class="product-view__title">{{ product.name }}</h1>
        <p class="product-view__price">{{ product.price }} €</p>
        
        <div class="product-view__description">
          <p>{{ product.description }}</p>
        </div>

        <!-- Variations de couleur -->
        <div v-if="product.colorVariations && product.colorVariations.length > 0" class="product-view__colors">
          <label class="product-view__colors-label">Couleur :</label>
          <div class="product-view__colors-list">
            <button
              v-for="colorVar in product.colorVariations"
              :key="colorVar.name"
              @click="handleColorSelect(colorVar)"
              :class="['product-view__color-btn', { 'product-view__color-btn--active': selectedColor?.name === colorVar.name }]"
              :style="{ backgroundColor: colorVar.color }"
              :title="colorVar.name"
              :disabled="!colorVar.available"
            ></button>
          </div>
          <p v-if="selectedColor" class="product-view__color-name">{{ selectedColor.name }}</p>
        </div>

        <div class="product-view__details">
          <div class="product-view__detail-item">
            <span class="product-view__detail-label">Catégorie</span>
            <span class="product-view__detail-value">{{ getCategoryLabel(product.category) }}</span>
          </div>
          <div class="product-view__detail-item">
            <span class="product-view__detail-label">Matériau</span>
            <span class="product-view__detail-value">{{ product.material }}</span>
          </div>
          <div class="product-view__detail-item">
            <span class="product-view__detail-label">Dimensions</span>
            <span class="product-view__detail-value">{{ product.dimensions }}</span>
          </div>
        </div>

        <div class="product-view__actions">
          <button class="product-view__button" @click="handleAddToCart">Ajouter au panier</button>
          <button class="product-view__button product-view__button--secondary">Contacter</button>
        </div>
      </div>
    </div>
    
    <!-- Produits suggérés -->
    <ProductSuggestions 
      v-if="product"
      :current-product-id="product.id"
      :category="product.category"
      :limit="4"
    />
  </main>
</template>

<style scoped lang="scss">
.product-view {
  padding: 30px 0;
  background-color: var(--color-beige);
  min-height: calc(100vh - 80px);
  max-width: 100%;
  
  &__container {
    max-width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--padding-md);
    position: relative;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__gallery {
    display: flex;
    flex-direction: column;
  }
  
  &__image-item {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    outline: var(--border);
    background-color: #f0f0f0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__info {
    display: flex;
    padding: var(--padding-xs); 
    flex-direction: column;
    position: sticky;
    top: 90px;
    align-self: flex-start;
    gap: var(--padding-xs);
    height: fit-content;
  }
  
  &__title {
    font-family: "Lovan", serif;
    font-size:clamp(4rem, 6.5vw, 7.4rem);
    color: var(--color-marron);
    font-weight: 400;
    margin: 0;
    line-height: 0.9;
  }
  
  &__price {
    font-family: 'Regarn', serif;
    font-size: var(--font-lg);
    color: var(--color-marron);
    font-weight: 500;
    line-height: 0.9;
    margin-top: 1rem;
    border-top: var(--border);
    padding-top: var(--padding-sm);
  }
  
  &__description {
    padding: var(--padding-xs) 0;
    
    p {
      font-size: clamp(1.2rem, 1.8vw, 1.4rem);
      color: var(--color-marron);
      font-weight: 300;
      line-height: 1.6;
      margin: 0;
    }
  }
  
  &__details {
    display: flex;
    flex-direction: column;
    gap: var(--padding-xs);
    padding: var(--padding-sm) 0;
    outline: var(--border);
    border-radius: calc(var(--border-radius) / 2);
    padding: var(--padding-sm);
    margin-bottom: var(--padding-sm);
  }
  
  &__detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--padding-xs) 0;
    
    &:not(:last-child) {
      border-bottom: var(--border);
    }
  }
  
  &__detail-label {
    font-size: var(--font-sm);
    color: var(--color-marron);
    font-weight: 500;
  }
  
  &__detail-value {
    font-size: var(--font-sm);
    color: var(--color-marron);
    font-weight: 300;
  }
  
  &__actions {
    display: flex;
    gap: var(--padding-xs);
    flex-wrap: wrap;
    
  }
  
  &__button {
    flex: 1;
    min-width: 200px;
    padding: var(--padding-xs) var(--padding-sm);
    font-size: var(--font-sm);
    font-weight: 300;
    color: var(--color-beige);
    background-color: var(--color-marron);
    border: none;
    outline: var(--border);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: opacity var(--transition);
    
    &:hover {
      opacity: 0.9;
    }
    
    &--secondary {
      background-color: transparent;
      color: var(--color-marron);
      
      &:hover {
        background-color: var(--color-sable);
      }
    }
  }
  
  &__colors {
    display: flex;
    flex-direction: column;
    gap: var(--padding-xs);
    padding: var(--padding-sm) 0;
  }
  
  &__colors-label {
    font-size: var(--font-sm);
    font-weight: 500;
  }
  
  &__colors-list {
    display: flex;
    gap: var(--padding-sm);
    flex-wrap: wrap;
  }
  
  &__color-btn {
    width: auto;
    height: 40px;
    padding: 10px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    cursor: pointer;
    transition: transform var(--transition);
    outline: 2px solid var(--color-marron);
    
    &:hover:not(:disabled) {
      transform: scale(1);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &--active {
      border-width: 3px;
      transform: scale(1);
    }
  }
  
  &__color-name {
    font-size: var(--font-sm);
    color: var(--color-marron);
    font-weight: 300;
    margin: 0;
  }
}
</style>
