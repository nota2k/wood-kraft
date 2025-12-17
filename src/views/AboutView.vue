<template>
  <div class="about">
    <div class="about__content">
        <h1 class="about__title">About our company</h1>
        <p class="about__text">At Wood&Kraft, we believe that furniture tells a story. A story of raw materials, craftsmanship, and time. Our store was born from a passion for wood and a deep respect for artisanal work, with one simple goal: to offer durable, elegant, and timeless wooden furniture made to last.</p>  
        <div class="marquee">
          <div class="marquee__wrapper">
            <div class="marquee__content">
              <h1>Our values</h1>
              <h1>Our values</h1>
              <h1>Our values</h1>
              <h1>Our values</h1>
            </div>
          </div>
        </div>
        <p class="about__text">At Wood&Kraft, we believe that furniture tells a story. A story of raw materials, craftsmanship, and time. Our store was born from a passion for wood and a deep respect for artisanal work, with one simple goal: to offer durable, elegant, and timeless wooden furniture made to last.</p>  
        <h1 class="about__title">Our values</h1>
        <p class="about__text">At Wood&Kraft, we believe that furniture tells a story. A story of raw materials, craftsmanship, and time. Our store was born from a passion for wood and a deep respect for artisanal work, with one simple goal: to offer durable, elegant, and timeless wooden furniture made to last.</p>  
      </div>
  </div>
</template>

<style scoped lang="scss">
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-size: var(--font-xl);
      font-weight: 300;
      color: var(--color-marron);
      margin-bottom: 2rem;
      line-height: 1.3;
    }

    p {
      font-size: var(--font-md);
      font-weight: 300;
      color: var(--color-marron);
      margin-bottom: 2rem;
    }

    &__text {
      max-width: 80%;
      align-self: flex-start;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: var(--padding-xs);
      width: 100%;
    }

    .marquee {
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
      position: relative;
      margin: var(--padding-md) 0;
      border-bottom: var(--border);
      border-top: var(--border);
      rotate: -2deg;
      padding: 0;

      &__wrapper {
        display: flex;
        width: fit-content;
        will-change: transform;
      }

      &__content {
        display: inline-flex;
        gap: 4rem;
        flex-shrink: 0;
        animation: scroll 10s linear infinite;

        h1 {
          font-size: var(--font-lg);
          margin: 0;
          border: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
      }
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(calc(-50% - 2rem));
      }
    }
  }
}
</style>
