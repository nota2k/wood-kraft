<template>
  <section class="about-us">
    <div class="about-us__container">
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
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    align-items: center;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
  
  &__image-wrapper {
    position: relative;
    align-self: flex-start;
    width: 80%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__title-overlay {
    right: 0;
    font-family: "Lovan", serif;
    font-size: clamp(6rem, 12vw, 12rem);
    color: var(--color-marron-light);
    z-index: 2;
    pointer-events: none;
    margin-bottom: 4rem;
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
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2rem;
  }
  
  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: clamp(36px, 2vw, 28px);
    color: var(--color-vert-gris);
    font-weight: 200;
    max-width: 520px;
    margin-right: 130px;
    text-align: justify;
    line-height: 1.3;
  }
  
  &__button {
    max-width: var(--medium-button);
  }
}
</style>

