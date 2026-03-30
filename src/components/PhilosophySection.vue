<script setup>
import { ref, onMounted } from 'vue'
import { MoveRight } from 'lucide-vue-next'
import { useScrollReveal } from '@/composables/useScrollReveal'

const titleOverlay = ref(null)
const imageWrapper = ref(null)
const content = ref(null)
const button = ref(null)
const { revealFrom } = useScrollReveal()

onMounted(() => {
  revealFrom(titleOverlay.value, { y: -50, scale: 0.97 })
  revealFrom(imageWrapper.value, { x: -60 }, { start: 'top 80%' })
  revealFrom(content.value, { x: 60, y: 20 }, { start: 'top 80%' })
  revealFrom(button.value, { y: 20 }, { start: 'top 90%' })
})
</script>

<template>
  <section class="philosophy">
    <div class="philosophy__container">
      <h2 ref="titleOverlay" class="philosophy__title-overlay">PHILOSOPHY</h2>
      <div ref="imageWrapper" class="philosophy__image-wrapper">

        <img src="@/assets/images/home-philosophy.png" alt="Philosophy" class="philosophy__image" />
      </div>
      <div ref="content" class="philosophy__content">
        <p class="philosophy__text">
          Pour nous, le bois est un matériau vivant qui évolue avec le temps. Nous choisissons d'accompagner
          cette évolution plutôt que de la contraindre. Chaque pièce que nous créons est pensée pour durer,
          pour s'adapter, pour raconter une histoire. Nous rejetons la production rapide et privilégions
          la qualité, la durabilité et l'authenticité.
        </p>
      </div>
      <button ref="button" class="philosophy__button-text more">More <svg xmlns="http://www.w3.org/2000/svg" width="24"
          height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right">
          <circle cx="12" cy="12" r="10" />
          <path d="m12 16 4-4-4-4" />
          <path d="M8 12h8" />
        </svg></button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.philosophy {
  padding: 6rem 2rem;
  background-color: var(--color-beige);
  overflow: hidden;

  &__container {
    grid-column: 1 / -1;
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    position: relative;
    grid-template-columns: repeat(6, 1fr);
    gap: 6rem;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__image-wrapper {
    grid-column: 2 / span 2;
    grid-row: 1 / span 2;
    position: relative;
    height: 100%;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      grid-row: auto;
      height: 300px;
    }
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

    @media (max-width: 768px) {
      font-size: clamp(3rem, 15vw, 5rem);
      top: -30px;
      text-align: center;
      word-break: break-word;
    }
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
    grid-column: 4 / span 3;
    margin-top: 8rem;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      margin-top: 1rem;
    }
  }

  &__text {
    font-family: 'Regarn', sans-serif;
    font-size: var(--font-md);
    color: var(--color-marron-light);
    font-weight: 300;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  &__button-text {
    grid-column: 4 / span 3;
    width: 100%;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
    }
  }
}
</style>
