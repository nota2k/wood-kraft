<script setup>
// About us section component
</script>

<template>
  <section class="about-us">
      <div class="about-us__image-wrapper">
        <div class="about-us__image-wrapper-inner">
        <img 
          src="@/assets/images/home-aboutus.png" 
          alt="Artisan travaillant le bois" 
          class="about-us__image"
        />
        </div>
      </div>
      <div class="about-us__second-image-wrapper">
        <img 
          src="@/assets/images/home-aboutus-02.png" 
          alt="Artisan travaillant le bois" 
          class="about-us__second-image"
        />
      </div>
      <div class="about-us__content">
        <h2 class="about-us__title-overlay">ABOUT US</h2>

        <p class="about-us__text">
          Derrière chaque création se cache un ébéniste passionné, amoureux du travail manuel et du détail. 
          Nous concevons et fabriquons des meubles sur mesure, en collaboration étroite avec nos clients. 
          Chaque projet est une aventure unique, où le bois révèle son caractère et sa beauté naturelle.
        </p>
        <button class="about-us__button">More →</button>
      </div>
  </section>
</template>

<style scoped lang="scss">
.about-us {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  
  &__image-wrapper {
    grid-column: 1 / span 5;
    position: relative;
    align-self: flex-start;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__title-overlay {
    font-family: "Lovan", serif;
    font-size: clamp(8rem, 17vw, 17rem);
    color: var(--color-marron-light);
    z-index: 2;
    pointer-events: none;
    margin-bottom: 2rem;
    grid-column: 1 / span 2;
    white-space: nowrap;
    position: relative;
    font-weight: 400;

    &__image-wrapper-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }    
  }

  &__second-image {
      position: absolute;
      width: 100%;
      max-width: 330px;
      right: 8%;
      height: 70%;
      bottom: 0;
      object-fit: cover;
    }
  
  &__content {
    grid-column: 3 / span 4;
    position: relative;
    top: -8rem;
    display: grid;
    grid-template-columns: subgrid;
    gap: 2rem;
  }
  
  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: clamp(36px, 2vw, 28px);
    color: var(--color-vert-gris);
    font-weight: 200;
    margin-right: 180px;
    text-align: justify;
    grid-column: 1 / span 4;
    line-height: 1.3;
  }
  
  &__button {
    grid-column: 1 / span 3;
    grid-row: 3 / span 1;
    align-self: flex-end;
  }
}
</style>
