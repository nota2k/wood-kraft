<template>
  <section class="about-us">
    <div class="about-us__container">
      <div class="about-us__image-wrapper">
        <h2 class="about-us__title-overlay">ABOUT US</h2>
        <img 
          src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=1000&fit=crop" 
          alt="Artisan travaillant le bois" 
          class="about-us__image"
        />
      </div>
      <div class="about-us__content">
        <p class="about-us__text">
          Derrière chaque création se cache un ébéniste passionné, amoureux du travail manuel et du détail. 
          Nous concevons et fabriquons des meubles sur mesure, en collaboration étroite avec nos clients. 
          Chaque projet est une aventure unique, où le bois révèle son caractère et sa beauté naturelle.
        </p>
        <button class="about-us__button">More →</button>
      </div>
    </div>
  </section>
</template>

<script setup>
// About us section component
</script>

<style scoped lang="scss">
.about-us {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
  
  &__image-wrapper {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
  }
  
  &__title-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Lovan', serif;
    font-size: clamp(4rem, 8vw, 7rem);
    color: var(--color-marron);
    opacity: 0.3;
    z-index: 2;
    pointer-events: none;
    white-space: nowrap;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    color: var(--color-vert-gris);
    font-weight: 300;
    line-height: 1.6;
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
    width: fit-content;
    transition: opacity 0.3s;
    font-weight: 400;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>

