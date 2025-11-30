<template>
  <section class="image-gallery">
    <div class="image-gallery__container">
      <div class="image-gallery__item">
        <img 
          src="@/assets/images/home-transition-01.png" 
          alt="Fleur dans un vase" 
          class="image-gallery__image"
        />
      </div>
      <div class="image-gallery__item">
        <img 
          src="@/assets/images/home-transition-02.png" 
          alt="Plantes dans des pots en bois" 
          class="image-gallery__image"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// Image gallery component
</script>

<style scoped lang="scss">
.image-gallery {
  padding: 4rem 2rem;
  background-color: var(--color-beige);
  
  &__container {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  &__item {
    aspect-ratio: 3/4;
    overflow: hidden;
    background-color: #f0f0f0;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

