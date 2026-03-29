<template>
  <div class="about">
    <div class="about__content">
        <h1 class="about__title">About our company</h1>
        <p class="about__text">At Wood&Kraft, we believe that furniture tells a story. A story of raw materials, craftsmanship, and time. Our store was born from a passion for wood and a deep respect for artisanal work, with one simple goal: to offer durable, elegant, and timeless wooden furniture made to last.</p>  
        <div class="marquee">
          <div class="marquee__wrapper">
            <div class="marquee__content">
              <span>Our values</span>
              <span>Our values</span>
              <span>Our values</span>
              <span>Our values</span>
            </div>
            <div class="marquee__content" aria-hidden="true">
              <span>Our values</span>
              <span>Our values</span>
              <span>Our values</span>
              <span>Our values</span>
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
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-sm) var(--padding-xs);

  h1 {
    font-size: var(--font-lg);
    font-weight: 300;
    color: var(--color-marron);
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  p {
    font-size: var(--font-base);
    font-weight: 300;
    color: var(--color-marron);
    margin-bottom: 1.5rem;
  }

  &__text {
    width: 100%;
    align-self: flex-start;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .marquee {
    overflow: hidden;
    width: 110%;
    margin-left: -5%;
    white-space: nowrap;
    position: relative;
    margin: 2rem 0;
    border-bottom: var(--border);
    border-top: var(--border);
    rotate: -3deg;
    padding: 0.5rem 0;
    background: var(--color-beige);

    &__wrapper {
      display: flex;
      width: fit-content;
      will-change: transform;
    }

    &__content {
      display: inline-flex;
      gap: 2rem;
      flex-shrink: 0;
      animation: scroll 15s linear infinite;

      span {
        font-family: 'Lovan', serif; // Use the brand font
        font-size: var(--font-lg);
        margin: 0;
        border: none;
        white-space: nowrap;
        flex-shrink: 0;
        text-transform: uppercase;
      }
    }
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-50% - 1rem));
    }
  }
}

@media (min-width: 1024px) {
  .about {
    padding: var(--padding-md);

    h1 {
      font-size: var(--font-xl);
      margin-bottom: 2rem;
    }

    p {
      font-size: var(--font-md);
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
