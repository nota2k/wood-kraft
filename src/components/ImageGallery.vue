<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const item1 = ref(null)
const item2 = ref(null)
const { revealFrom } = useScrollReveal()

onMounted(() => {
  revealFrom(item1.value, { x: -60, y: 30 })
  revealFrom(item2.value, { x: 60, y: 30 }, { start: 'top 80%' })
})
</script>

<template>
  <section class="image-gallery">
      <div ref="item1" class="image-gallery__item">
        <img src="@/assets/images/home-transition-01.png" alt="Fleur dans un vase" class="image-gallery__image" />
      </div>
      <div ref="item2" class="image-gallery__item">
        <img src="@/assets/images/home-transition-02.png" alt="Plantes dans des pots en bois"
          class="image-gallery__image" />
      </div>
  </section>
</template>

<style scoped lang="scss">
.image-gallery {
  padding: 4rem 2rem;
  min-height: 60vh;
  background-color: var(--color-beige);
  align-items: center;

  @media (max-width: 768px) {
    height: auto;
    padding: 2rem 1rem;
  }

  &__item {
    aspect-ratio: 3 / 5;
    background-color: #f0f0f0;

    &:nth-child(1) {
      grid-column: 1 / 3;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }

    &:nth-child(2) {
      grid-column: 4 / span 3;
      width: 100%;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

