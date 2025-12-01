<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MiniCart from './MiniCart.vue'
import CartModal from './CartModal.vue'

defineOptions({
    name: 'SiteHeader'
})

const isVisible = ref(true)
const isCartOpen = ref(false)
let lastScrollY = 0

const handleScroll = () => {
    const currentScrollY = window.scrollY

    // Si on est tout en haut, toujours afficher le header
    if (currentScrollY < 10) {
        isVisible.value = true
        lastScrollY = currentScrollY
        return
    }

    // Si on scroll vers le bas, cacher le header
    if (currentScrollY > lastScrollY) {
        isVisible.value = false
    } else {
        // Si on scroll vers le haut, afficher le header
        isVisible.value = true
    }

    lastScrollY = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

const handleCartClick = () => {
    isCartOpen.value = true
}

const handleCartClose = () => {
    isCartOpen.value = false
}
</script>

<template>
  <header class="header" :class="{ 'header--hidden': !isVisible }">
    <div class="header__container">
      <router-link to="/">
        <div class="header__logo">
          <img src="@/assets/images/logo.svg" alt="WOOD & KRAFT" class="header__logo-img" />
        </div>
      </router-link>
      
      <button class="header__menu-toggle" aria-label="Menu">
        
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="nav-wrapper">
      <nav class="header__nav">
        <router-link to="/products" class="header__nav-link">Products</router-link>
        <a href="#" class="header__nav-link">About</a>
        <a href="#" class="header__nav-link">Contact</a>
      </nav>
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.804 22.2793C52.9248 16.7119 49.1225 12.1537 42.5026 8.7307C40.6302 7.76212 38.8874 6.81415 37.2477 5.92198C25.8369 -0.28584 18.9489 -4.03357 8.32978 7.27738C2.38609 13.6075 -0.328389 19.5819 0.0315788 25.5418C0.376945 31.2592 3.44756 37.0213 9.69428 43.6747C15.941 50.328 21.351 53.5985 26.719 53.9664C27.0464 53.9885 27.373 54 27.7009 54C32.9713 54 38.2715 51.0883 43.8671 45.128C51.4529 37.0489 54.8891 29.1474 53.804 22.2793ZM42.5026 43.6747C31.6799 55.2014 22.8639 54.7939 11.0588 42.2213C-0.7458 29.6473 -1.12843 20.2579 9.69428 8.73068C14.2029 3.92859 17.8487 2.05573 21.6186 2.05573C25.8973 2.05573 30.3352 4.46953 36.3699 7.7526C38.0204 8.65039 39.7746 9.6048 41.6602 10.5794C47.6855 13.6954 51.1311 17.7467 51.901 22.6205C52.8641 28.7169 49.5263 36.1938 42.5026 43.6747Z" fill="#97904F"/>
        <path d="M36.7129 14.8973C35.2871 14.1535 33.9928 13.4259 32.7414 12.7229C25.6683 8.7458 20.9957 6.12018 14.1194 13.444C6.67922 21.3685 7.08725 28.5649 15.4839 37.5082C19.9171 42.2305 23.8933 44.5801 27.7545 44.5801C31.2058 44.5801 34.5657 42.7017 38.0773 38.9615C42.9417 33.7806 45.1415 28.6678 44.439 24.1754C43.8464 20.3839 41.2469 17.262 36.7129 14.8973ZM36.7129 37.5081C30.0562 44.5965 24.4875 44.1895 16.8485 36.0548C9.21038 27.919 8.82777 21.9872 15.484 14.8973C18.1918 12.0137 20.3959 10.879 22.6707 10.879C25.3271 10.879 28.0792 12.4262 31.841 14.5405C33.1047 15.2511 34.4122 15.9857 35.8638 16.743C39.8061 18.7996 42.0508 21.4136 42.5356 24.513C43.1227 28.2682 41.0547 32.8836 36.7129 37.5081Z" fill="#97904F"/>
        <path d="M30.9232 21.0639C30.0313 20.5856 29.2407 20.0823 28.4755 19.5955C25.722 17.8436 23.1221 16.189 19.9092 19.6105C15.6574 24.1386 18.213 28.0815 21.2737 31.3415C23.1754 33.3669 25.3244 35.1845 27.6995 35.1845C28.5763 35.1374 29.435 34.9013 30.2236 34.4905C31.0123 34.0798 31.7145 33.5029 32.2878 32.7947C34.4396 30.5033 35.4088 28.1788 35.0908 26.0736C34.8292 24.9414 34.3132 23.8939 33.5872 23.0212C32.8612 22.1485 31.947 21.4768 30.9232 21.0639ZM30.9232 31.3415C29.1008 33.2826 27.8032 33.253 26.9871 33.0628C25.2915 32.4496 23.7869 31.3513 22.6382 29.8882C19.0309 26.0461 18.6865 23.8194 21.2736 21.0639C21.5785 20.6607 21.9575 20.3282 22.3874 20.0868C22.8174 19.8454 23.2891 19.7002 23.7737 19.6602C25.1243 19.8897 26.4 20.4738 27.4855 21.3599C28.2432 21.8417 29.1012 22.3882 30.0553 22.8996C31.9333 23.9073 32.9869 25.0846 33.1852 26.3999C33.1714 27.3499 32.9616 28.2849 32.5707 29.1389C32.1798 29.9929 31.6174 30.7448 30.9232 31.3415Z" fill="#97904F"/>
        </svg>

      
      <MiniCart @click="handleCartClick" />
    </div>
    </div>
    <CartModal :is-open="isCartOpen" @close="handleCartClose" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-beige);
  padding: 1.5rem 2rem;
  transform: translateY(0);
  transition: transform var(--transition);
  box-shadow: 0 2px 4px rgba(104, 76, 36, 0.4);

  &--hidden {
    transform: translateY(-100%);
  }
  
  &__container {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    &-img {
      width: 120px;
      height: auto;
    }
    
    &-text {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }
    
    &-wood {
      font-family: 'Lovan', serif;
      font-size: 1.5rem;
      color: var(--color-marron);
    }
    
    &-kraft {
      font-family: 'Regarn', sans-serif;
      font-size: 1.2rem;
      color: var(--color-marron);
      font-weight: 400;
    }
  }
  .nav-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  &__menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-marron);
    
    @media (max-width: 768px) {
      display: block;
    }
  }
  
  &__nav {
    display: flex;
    gap: 2rem;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &__nav-link {
    font-family: 'Regarn', sans-serif;
    font-size: 1.1rem;
    color: var(--color-marron);
    text-decoration: none;
    font-weight: 400;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

