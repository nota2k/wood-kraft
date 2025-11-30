<template>
  <section class="our-products">
    <div class="our-products__container">
      <h2 class="our-products__title">OUR PRODUCTS</h2>
      <div class="our-products__grid">
        <div class="our-products__item" v-for="(product, index) in products" :key="index">
          <div class="our-products__image-wrapper">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="our-products__image"
            />
          </div>
          <div class="our-products__info">
            <p class="our-products__label">Product</p>
            <p class="our-products__price">{{ product.price }} €</p>
          </div>
        </div>
      </div>
      <button class="our-products__button">More →</button>
    </div>
  </section>
</template>

<script setup>
const products = [
  {
    name: 'Tables hexagonales',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    price: '--'
  },
  {
    name: 'Table d\'appoint',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop',
    price: '--'
  },
  {
    name: 'Armoire',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    price: '--'
  },
  {
    name: 'Étagère',
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=600&fit=crop',
    price: '--'
  }
]
</script>

<style scoped lang="scss">
.our-products {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
  }
  
  &__title {
    font-family: 'Lovan', serif;
    font-size: clamp(3rem, 6vw, 5rem);
    color: var(--color-marron);
    margin-bottom: 4rem;
    text-align: center;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  &__item {
    display: flex;
    flex-direction: column;
  }
  
  &__image-wrapper {
    aspect-ratio: 1;
    overflow: hidden;
    background-color: #f0f0f0;
    margin-bottom: 1rem;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__label {
    font-family: 'Regarn', sans-serif;
    font-size: 0.9rem;
    color: var(--color-marron);
    font-weight: 400;
    margin: 0;
  }
  
  &__price {
    font-family: 'Regarn', sans-serif;
    font-size: 0.9rem;
    color: var(--color-marron);
    font-weight: 400;
    margin: 0;
  }
  
  &__button {
    font-family: 'Regarn', sans-serif;
    font-size: 1rem;
    color: white;
    background-color: var(--color-vert-gris);
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
    transition: opacity 0.3s;
    font-weight: 400;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>

