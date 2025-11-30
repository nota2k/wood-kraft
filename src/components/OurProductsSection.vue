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
            <div class="our-products__label-wrapper">
              <p class="our-products__label">Product</p>
            </div>
            <div class="our-products__price-wrapper">
              <p class="our-products__price">{{ product.price }} €</p>
            </div>
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
    font-family: 'Rokurou', sans-serif;
    font-weight: 300;
    font-size: var(--font-xl);
    color: var(--color-sable);
    margin-bottom: 4rem;
    text-align: center;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-template-rows: repeat(3, minmax(450px, 1fr));
    margin-bottom: 3rem;
  }
  
  &__item {
    display: grid;
    grid-template-rows: auto 70px;
    grid-template-columns: 2fr 1fr;
    flex-direction: column;
  }
  
  &__image-wrapper {
    grid-column: 1 / 3;
    overflow: hidden;
    background-color: #f0f0f0;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__info {
    grid-column: 1 / -1;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border: 2px solid var(--color-sable);
    
  }

  &__label-wrapper {
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-grow: 2;
    font-size: var(--font-lg);
    color: var(--color-marron);
    font-weight: 300;
    border-right: 2px solid var(--color-sable);
  }
  
  &__price-wrapper {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 130px;
    font-size: var(--font-lg);
    color: var(--color-marron);
    font-weight: 300;
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

