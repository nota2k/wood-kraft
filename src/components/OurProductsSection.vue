<script setup>
// Import des images depuis assets/images
import productImage01 from '@/assets/images/home-ourproducts-01.png'
import productImage02 from '@/assets/images/home-ourproducts-02.png'
import productImage03 from '@/assets/images/home-ourproducts-03.png'
import productImage04 from '@/assets/images/home-ourproducts-04.png'
import productImage05 from '@/assets/images/home-ourproducts-05.png'
import { MoveRight } from 'lucide-vue-next'
const products = [
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
    name: 'Étagère',
    image: productImage05,
    price: '--'
  },
  {
    name: 'Étagère',
    image: productImage04,
    price: '--'
  },
  {
    name: 'Étagère',
    image: productImage04,
    price: '--'
  }
]
</script>

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
      <button class="our-products__button">More <span class="our-products__button-icon"><MoveRight/></span></button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.our-products {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
  grid-column: 1 / -1;

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
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    grid-template-rows: repeat(3, minmax(450px, 1fr));
    margin-bottom: 3rem;
  }
  
  &__item {
    display: grid;
    grid-template-rows: auto 110px;
    grid-template-columns: 2fr 1fr;
    flex-direction: column;
    border: 2px solid var(--color-marron-light);
    --line-offset: 2px;
    --line-thickness: 2px;


    &:nth-child(4) {
      grid-column: 2 / span 2;
      grid-row: 2 / span 2;
    }
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
    outline: var(--line-thickness) solid var(--color-marron-light);
    
  }

  &__label-wrapper {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    flex-grow: 2;
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
    outline: 2px solid var(--color-marron-light);
  }
  
  &__price-wrapper {
    padding: 1rem 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 130px;
    font-size: var(--font-md);
    color: var(--color-marron);
    font-weight: 300;
  }
  
  &__button {

    max-width: var(--large-button);
    margin: 0 auto;
    text-align: left;
    width: 100%;
  }
}
</style>

