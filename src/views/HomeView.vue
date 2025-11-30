<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import WoodDesignSection from '@/components/WoodDesignSection.vue'
import AboutUsSection from '@/components/AboutUsSection.vue'
import OurProductsSection from '@/components/OurProductsSection.vue'
import PhilosophySection from '@/components/PhilosophySection.vue'
</script>

<template>
  <main class="home">
    <HeroSection />
    <ImageGallery />
    <WoodDesignSection />
    <AboutUsSection />
    <OurProductsSection />
    <PhilosophySection />
  </main>
</template>

<style scoped lang="scss">
.home {
  background-color: var(--color-beige);
  min-height: 100vh;
}
</style>
