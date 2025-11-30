<script setup>
// Image gallery component
</script>

<template>
  <section class="image-gallery">
      <div class="image-gallery__item">
        <img src="@/assets/images/home-transition-01.png" alt="Fleur dans un vase" class="image-gallery__image" />
      </div>
      <div class="image-gallery__item">
        <img src="@/assets/images/home-transition-02.png" alt="Plantes dans des pots en bois"
          class="image-gallery__image" />
      </div>
  </section>
</template>

<style scoped lang="scss">
.image-gallery {
  padding: 4rem 2rem;
  height: 100vh;
  background-color: var(--color-beige);

  &__container {
    max-width: 1280px;
  }

  &__item {
    aspect-ratio: 3 / 5;
    background-color: #f0f0f0;

    &:nth-child(1) {
      grid-column: 1 /  3;

    }

    &:nth-child(2) {
      grid-column: 4 / span 3;
      width: 100%;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
