<template>
  <section class="wood-design">
      <div class="wood-design__image-wrapper">
        <img 
          src="@/assets/images/home-canard.png" 
          alt="Canard en bois" 
          class="wood-design__image"
        />
      </div>
      <div class="wood-design__content">
        <h2 class="wood-design__title">WOOD DESIGN</h2>
        <p class="wood-design__text">
          Chez WOOD & KRAFT, nous créons des pièces uniques qui allient savoir-faire artisanal et design contemporain. 
          Chaque création est le fruit d'une passion pour le bois, matériau noble et vivant. Nous privilégions les 
          formes organiques et les lignes pures, pour des meubles qui s'intègrent harmonieusement dans votre espace.
        </p>
      </div>
  </section>
</template>

<script setup>
// Wood design section component
</script>

<style scoped lang="scss">
.wood-design {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__image-wrapper {
    position: relative;
    width: 100%;
    right: -6rem;
    grid-column: 1 / span 3;
    aspect-ratio: 2/3;
    background-color: var(--color-vert-gris);
    
    @media (max-width: 1024px) {
      max-width: 100%;
      justify-self: center;
    }
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__content {
    display: flex;
    position: relative;
    top: 12rem;
    grid-column: 4 / span 3;
    flex-direction: column;
    background-color: var(--color-sable);
    gap: 2rem;
    padding: 3rem;
  }
  
  &__title {
    font-family: 'Lovan', sans-serif;
    font-size: clamp(3rem, 7vw, 7rem);
    color: var(--color-vert-gris);
    font-weight: 300;
    margin: 0;
    line-height: 0.8em;
  }
  
  &__text {
    font-family: 'Lucette', sans-serif;
    font-size: clamp(28px, 1.5vw, 1.5rem);
    color: var(--color-vert-gris);
    font-weight: 300;
    line-height: 1.6;
    max-width: 600px;
  }
}
</style>

