<template>
  <section class="philosophy">
    <div class="philosophy__container">
      <h2 class="philosophy__title-overlay">PHILOSOPHY</h2>
      <div class="philosophy__image-wrapper">
        
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
        <button class="philosophy__button-text">More →</button>
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
    position: relative;
    grid-template-columns: minmax(250px, 400px) minmax(400px, 1fr);
    gap: 6rem;
    align-items: center;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
  
  &__image-wrapper {
    position: relative;
    max-width: 100%;
    height: 100%;
  }
  
  &__title-overlay {
    position: absolute;
    top: -80px;
    left: 0;
    font-family: 'Rokurou', serif;
    font-size: clamp(12rem, 12vw, 13rem);
    color: var(--color-marron-light);
    font-weight: 300;
    text-align: right;
    right: 0;
    width: 100%;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
  }
  
  &__content {
    align-self: flex-start;
    max-width: 450px;
    margin-top: 8rem;
  }
  
  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: var(--font-md);
    color: var(--color-marron-light);
    font-weight: 300;
    line-height: 1.6;
  }

  &__button {
    max-width: var(--large-button);
    margin: 0 auto;
    width: 100%;
  }
}
</style>

