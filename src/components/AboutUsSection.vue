<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const imageWrapper = ref(null)
const secondImage = ref(null)
const titleOverlay = ref(null)
const content = ref(null)
const { revealFrom } = useScrollReveal()

onMounted(() => {
  revealFrom(imageWrapper.value, { x: -50, y: 30 })
  revealFrom(secondImage.value, { x: 50, y: 30 }, { start: 'top 75%' })
  revealFrom(titleOverlay.value, { y: -40, scale: 0.95 }, { start: 'top 80%' })
  revealFrom(content.value, { y: 50 }, { start: 'top 80%' })
})
</script>

<template>
  <section class="about-us">
    <div ref="imageWrapper" class="about-us__image-wrapper">
      <div class="about-us__image-wrapper-inner">
        <img src="@/assets/images/home-aboutus.png" alt="Artisan travaillant le bois" class="about-us__image" />
      </div>
    </div>
    <div ref="secondImage" class="about-us__second-image-wrapper">
      <img src="@/assets/images/home-aboutus-02.png" alt="Artisan travaillant le bois" class="about-us__second-image" />
    </div>
    <div ref="content" class="about-us__content">
      <h2 ref="titleOverlay" class="about-us__title-overlay">ABOUT US</h2>

      <p class="about-us__text">
        Derrière chaque création se cache un ébéniste passionné, amoureux du travail manuel et du détail.
        Nous concevons et fabriquons des meubles sur mesure, en collaboration étroite avec nos clients.
        Chaque projet est une aventure unique, où le bois révèle son caractère et sa beauté naturelle.
      </p>
      <button class="about-us__button more">More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right">
          <circle cx="12" cy="12" r="10" />
          <path d="m12 16 4-4-4-4" />
          <path d="M8 12h8" />
        </svg></button>
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

    @media (max-width: 768px) {
      grid-column: 1 / -1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title-overlay {
    font-family: "Lovan", serif;
    font-size: clamp(4rem, 17vw, 17rem);
    color: var(--color-marron-light);
    z-index: 2;
    pointer-events: none;
    margin-bottom: 2rem;
    grid-column: 1 / span 2;
    white-space: nowrap;
    position: relative;
    font-weight: 400;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      font-size: clamp(3.5rem, 14vw, 6rem);
      white-space: normal;
      word-break: break-word;
      margin-bottom: 1rem;
    }

    &__image-wrapper-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }

  &__second-image-wrapper {
    @media (max-width: 768px) {
      display: none;
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

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__content {
    grid-column: 3 / span 4;
    position: relative;
    top: -8rem;
    display: grid;
    grid-template-columns: subgrid;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      top: 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: clamp(18px, 2vw, 28px);
    color: var(--color-vert-gris);
    font-weight: 200;
    margin-right: 180px;
    text-align: justify;
    grid-column: 1 / span 4;
    line-height: 1.3;

    @media (max-width: 768px) {
      margin-right: 0;
      font-size: 1.1rem;
      text-align: left;
    }
  }

  &__button {
    grid-column: 1 / span 3;
    grid-row: 3 / span 1;
    align-self: flex-end;

    @media (max-width: 768px) {
      align-self: flex-start;
    }
  }
}
</style>
