<template>
  <section class="philosophy">
    <div class="philosophy__container">
      <div class="philosophy__image-wrapper">
        <h2 class="philosophy__title-overlay">PHILOSOPHY</h2>
        <img 
          src="@/assets/images/home-philosophy.png" 
          alt="Philosophy" 
          class="philosophy__image"
        />
      </div>
      <div class="philosophy__content">
        <p class="philosophy__text">
          Pour nous, le bois est un matériau vivant qui évolue avec le temps. Nous choisissons d'accompagner 
          cette évolution plutôt que de la contraindre. Chaque pièce que nous créons est pensée pour durer, 
          pour s'adapter, pour raconter une histoire. Nous rejetons la production rapide et privilégions 
          la qualité, la durabilité et l'authenticité.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Philosophy section component
</script>

<style scoped lang="scss">
.philosophy {
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
    color: var(--color-marron);
    font-weight: 300;
    line-height: 1.6;
  }
}
</style>

