<script setup>
// Header component
</script>

<template>
  <header class="header">
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
      
      <nav class="header__nav">
        <a href="#" class="header__nav-link">Homepage</a>
        <a href="#" class="header__nav-link">Products</a>
        <a href="#" class="header__nav-link">About</a>
        <a href="#" class="header__nav-link">Contact</a>
      </nav>
    </div>
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
  
  &__container {
    max-width: 1280px;
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
    font-size: 0.9rem;
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

