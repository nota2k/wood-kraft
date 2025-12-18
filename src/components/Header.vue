<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import MiniCart from './MiniCart.vue'
import CartModal from './CartModal.vue'
import { animate, svg } from 'animejs'

defineOptions({
    name: 'SiteHeader'
})

const isVisible = ref(true)
const isCartOpen = ref(false)
const isNavOpen = ref(false)
let lastScrollY = 0

const handleScroll = () => {
    const currentScrollY = window.scrollY

    // Si on est tout en haut, toujours afficher le header
    if (currentScrollY < 10) {
        isVisible.value = true
        lastScrollY = currentScrollY
        return
    }

    // Si on scroll vers le bas, cacher le header
    if (currentScrollY > lastScrollY) {
        isVisible.value = false
    } else {
        // Si on scroll vers le haut, afficher le header
        isVisible.value = true
    }

    lastScrollY = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

const handleCartClick = () => {
    isCartOpen.value = true
}

const handleCartClose = () => {
    isCartOpen.value = false
}

const toggleNav = () => {
    isNavOpen.value = !isNavOpen.value
}

const closeNav = () => {
    isNavOpen.value = false
}

// Refs pour les paths SVG
const path1Ref = ref(null)
const path2Ref = ref(null)
const path3Ref = ref(null)

// Paths pour l'état fermé
const closedPaths = [
  'M52.0101 20.5978C53.4262 24.1441 52.7738 29.285 50.9408 32.6599C46.7765 40.3269 39.5983 52.4619 29.7511 52.1443C15.601 51.688 9.40966 45.1948 3.0392 32.4511C-4.2337 17.9021 9.39954 0.184215 21.1842 2.01561C32.8052 4.1276 47.1947 8.5395 52.0101 20.5978Z',
  'M24.2994 44.2856C16.7716 42.0013 10.8121 30.1539 9.23576 24.237C7.05921 16.0673 15.8808 5.59383 23.2335 9.41864C35.0362 15.5475 50.8769 19.2425 42.8445 30.6212C34.8121 42 29.97 46.0064 24.2994 44.2856Z',
  'M25.9087 35.5164C22.9806 34.6767 18.7751 28.4926 18.4882 25.4775C17.4496 14.563 25.9087 18 32.0731 23.7027C38.2375 29.4054 30.5187 36.8383 25.9087 35.5164Z'
]

// Paths pour l'état ouvert
const openPaths = [
  'M14.7996 26.8864C23.8046 19.2433 36.3439 10.9193 48.7198 14.8469C52.3595 16.002 55.9195 19.7678 57.3654 23.3258C60.65 31.4089 65.4764 44.6561 58.9837 52.0665C49.654 62.7149 40.707 63.3814 26.8146 60.221C24.3415 59.6584 22.1312 58.654 20.1958 57.329',
  'M21.8222 29.9989C34.0475 24.7637 46.9532 14.863 50.6531 28.2909C54.353 41.7187 54.378 48.0033 49.4504 51.295C43.6642 55.1602 32.8729 53.3301 26.6005 51.1015',
  'M30.1433 34.786C32.2917 33.5348 35.361 32.6568 38.4716 32.2279C46.7905 31.0807 47.6393 41.7628 43.6928 44.4876C41.6664 45.8868 36.4109 45.7154 33.1438 44.7051'
]

// Créer des éléments SVG temporaires pour les paths cibles
const createTargetPath = (pathData) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', pathData)
  return path
}

// Animer les paths
watch(isNavOpen, async (newValue) => {
  await nextTick()
  
  const targetPaths = newValue ? openPaths : closedPaths
  const pathRefs = [path1Ref, path2Ref, path3Ref]
  
  pathRefs.forEach((pathRef, index) => {
    if (pathRef.value) {
      const targetPath = createTargetPath(targetPaths[index])
      const morphValues = svg.morphTo(targetPath, 0.33)
      
      animate(pathRef.value, {
        d: morphValues,
        duration: 600,
        easing: 'easeInOutCubic'
      })
    }
  })
})
</script>

<template>
  <header class="header" :class="{ 'header--hidden': !isVisible, 'header--open': isNavOpen }">
    <div class="header__container">
      <router-link to="/">
        <div class="header__logo">
          <svg class="header__logo-img"  width="175" height="64" viewBox="0 0 175 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.39438 0.624744V0.312371H7.01997V0.624744C5.20582 0.624744 5.56076 1.679 6.54671 3.86561L16.209 25.5755L21.5332 13.7053L17.1161 3.82656C16.0118 1.40567 15.4203 0.585698 14.1977 0.585698V0.273325H20.8233V0.585698C19.0091 0.585698 19.3641 1.63996 20.35 3.82656L30.0123 25.5365L37.4267 9.0588C39.9902 3.358 40.8578 0.546652 37.1112 0.585698V0.273325H43.9734V0.585698C41.3705 0.585698 40.3845 3.358 37.8211 9.0588L30.2095 25.966L30.9589 27.6059C30.1701 27.6059 28.9081 27.7231 28.0799 28.2697L21.7304 14.1349L16.4062 26.005L17.1555 27.645C16.3668 27.645 15.1048 27.7621 14.2766 28.3088L3.31279 3.86561C2.20853 1.44472 1.61696 0.624744 0.39438 0.624744Z" fill="currentColor"/>
          <path d="M60.4647 27.9573C52.1432 27.9573 46.3458 22.3346 46.3458 13.9787C46.3458 5.62271 52.1432 0 60.4647 0C68.7861 0 74.5835 5.62271 74.5835 13.9787C74.5835 22.3346 68.7861 27.9573 60.4647 27.9573ZM60.4647 0.507604C52.8137 0.507604 49.4614 7.26266 49.4614 13.9787C49.4614 20.6947 52.8137 27.4497 60.4647 27.4497C68.1156 27.4497 71.4679 20.6947 71.4679 13.9787C71.4679 7.26266 68.1156 0.507604 60.4647 0.507604Z" fill="currentColor"/>
          <path d="M93.8175 27.9573C85.4961 27.9573 79.6987 22.3346 79.6987 13.9787C79.6987 5.62271 85.4961 0 93.8175 0C102.139 0 107.936 5.62271 107.936 13.9787C107.936 22.3346 102.139 27.9573 93.8175 27.9573ZM93.8175 0.507604C86.1665 0.507604 82.8143 7.26266 82.8143 13.9787C82.8143 20.6947 86.1665 27.4497 93.8175 27.4497C101.468 27.4497 104.821 20.6947 104.821 13.9787C104.821 7.26266 101.468 0.507604 93.8175 0.507604Z" fill="currentColor"/>
          <path d="M121.79 0.312371C130.112 0.312371 135.909 5.62271 135.909 13.9787C135.909 22.3346 130.112 27.645 121.79 27.645H111.892V27.3326C112.483 27.3326 113.587 26.9421 113.587 24.0917V3.86561C113.587 1.01521 112.483 0.624744 111.892 0.624744V0.312371H121.79ZM116.427 0.702836V27.2545H121.199C129.126 27.2545 132.794 21.7489 132.794 13.9787C132.794 6.2084 129.126 0.702836 121.199 0.702836H116.427Z" fill="currentColor"/>
          <path d="M24.6488 52.5594C24.6488 54.2384 23.6628 56.0735 21.8092 57.5964C22.8346 59.4706 23.4656 61.5791 23.4656 64H22.9529C22.9529 61.7353 22.3614 59.7439 21.3754 57.9087C19.1274 59.5487 15.8147 60.7201 11.6342 60.7201C3.31279 60.7201 0 57.0107 0 52.8717C0 48.6157 3.43111 45.6872 6.94109 43.5005C5.08751 41.3139 3.82549 38.8931 3.82549 35.9646C3.82549 30.8495 7.61154 28.6238 11.437 28.6238C16.6034 28.6238 19.4824 31.9428 19.4824 35.3398C19.4824 38.9321 17.4316 41.1187 13.685 43.1101L11.2793 44.3986C10.6483 44.711 10.0961 45.0624 9.544 45.3748C13.2906 48.889 18.1809 52.0908 21.0599 56.3859C23.3079 53.6136 23.2684 49.9432 20.0345 47.3662C21.3754 47.5614 24.6488 49.0452 24.6488 52.5594ZM4.33818 35.9646C4.33818 38.7369 5.6002 41.0797 7.41435 43.2272C8.24255 42.7587 9.03131 42.2901 9.78063 41.8996L11.437 41.0016C16.2485 38.3855 17.7866 36.5112 17.7866 34.1294C17.7866 31.5913 15.7358 29.1314 11.437 29.1314C7.72985 29.1314 4.33818 31.3571 4.33818 35.9646ZM11.6342 60.3296C15.6569 60.3296 18.8119 58.8849 20.705 56.8154C17.826 52.5203 12.8568 49.2794 9.03131 45.6872C4.10156 48.7718 2.16909 51.7003 2.16909 54.3945C2.16909 58.4944 6.15233 60.3296 11.6342 60.3296Z" fill="currentColor"/>
          <path d="M35.5872 49.1233V55.9174C35.5872 58.7678 36.6915 59.1582 37.283 59.1582V59.4706H31.0518V59.1582C31.6434 59.1582 32.7476 58.7678 32.7476 55.9174V35.6912C32.7476 32.8408 31.6434 32.4504 31.0518 32.4504V32.138H37.283V32.4504C36.6915 32.4504 35.5872 32.8408 35.5872 35.6912V48.6937L46.1566 38.3855C51.0075 33.6608 50.1004 32.4504 48.5229 32.4504V32.138H55.3851V32.4504C53.0188 32.4504 51.6385 33.5437 46.6298 38.3855L42.7255 42.212C44.3424 42.3292 45.6833 43.3053 48.8778 43.3053L54.478 55.9174C55.464 58.1821 56.095 59.1582 57.3964 59.1582V59.4706H50.7708V59.1582C52.585 59.1582 52.23 58.143 51.2441 55.9174L46.8665 46.0776C45.565 43.1491 43.6325 42.5244 42.41 42.4853L35.5872 49.1233Z" fill="currentColor"/>
          <path d="M60.5533 59.1582C61.1449 59.1582 62.2491 58.7678 62.2491 55.9174V35.6912C62.2491 32.8408 61.1449 32.4504 60.5533 32.4504V32.138H73.0157C79.8779 32.138 83.2302 34.2465 83.2302 38.4635C83.2302 43.071 79.0892 44.8672 74.1594 44.9843C76.4468 45.57 77.5511 46.5462 79.7596 46.5462L83.9401 55.9174C84.9654 58.1821 85.557 59.1582 86.8585 59.1582V59.4706H80.2329V59.1582C82.047 59.1582 81.7315 58.1821 80.7061 55.9174L77.4328 48.5766C76.2102 45.8433 74.3172 44.9843 71.1621 44.9843H65.0887V55.9174C65.0887 58.7678 66.1929 59.1582 66.7845 59.1582V59.4706H60.5533V59.1582ZM73.0157 44.5939C76.4468 44.5939 80.1146 43.1882 80.1146 38.4635C80.1146 33.4265 76.4468 32.5285 72.5425 32.5285H65.0887V44.5939H73.0157Z" fill="currentColor"/>
          <path d="M104.938 31.4742L115.862 55.9174C116.927 58.3382 117.558 59.1582 118.78 59.1582V59.4706H112.155V59.1582C113.969 59.1582 113.614 58.104 112.628 55.9174L110.222 50.4899H95.6698L95.5909 50.6851C93.0274 56.3859 92.1598 59.1973 95.9064 59.1582V59.4706H89.0442V59.1582C91.6471 59.1582 92.6331 56.3859 95.1965 50.6851L102.69 33.9732C101.98 32.8799 101.231 32.4504 100.205 32.4504V32.138C102.216 32.138 103.084 32.138 104.938 31.4742ZM102.926 34.3637L95.867 50.0994H110.025L103.636 35.7693C103.4 35.2227 103.163 34.7541 102.926 34.3637Z" fill="currentColor"/>
          <path d="M128.137 59.1582V59.4706H121.906V59.1582C122.497 59.1582 123.601 58.7678 123.601 55.9174V35.6912C123.601 32.8408 122.497 32.4504 121.906 32.4504V32.138H143.242L145.371 39.1273H145.056C143.399 34.1294 137.405 32.5285 128.965 32.5285H126.441V41.2359H128.019C132.081 41.2359 136.577 40.494 136.577 37.5655H136.892V45.3748H136.577C136.577 42.2511 132.081 41.6263 128.019 41.6263H126.441V55.9174C126.441 58.7678 127.545 59.1582 128.137 59.1582Z" fill="currentColor"/>
          <path d="M149.681 32.138H172.87L175 39.1273H174.684C172.713 32.9189 163.997 32.6456 162.695 32.6456V55.9174C162.695 58.7678 163.8 59.1582 164.391 59.1582V59.4706H158.16V59.1582C158.752 59.1582 159.856 58.7678 159.856 55.9174V32.6456C158.554 32.6456 149.839 32.9189 147.867 39.1273H147.551L149.681 32.138Z" fill="currentColor"/>
          </svg>

        </div>
      </router-link>
      
      <button class="header__menu-toggle" aria-label="Menu">
        
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="nav-wrapper">
      <nav class="header__nav" :class="{ 'header__nav--open': isNavOpen }">
        <router-link to="/products" class="header__nav-link" @click="closeNav">Products</router-link>
        <router-link to="/about" class="header__nav-link" @click="closeNav">About</router-link>
        <a href="#" class="header__nav-link" @click="closeNav">Contact</a>
      </nav>
      <button 
        class="nav-icon" 
        :class="{ 'nav-icon--open': isNavOpen }"
        @click="toggleNav" 
        aria-label="Toggle navigation"
      >
        <svg 
          class="nav-icon__svg" 
          :class="{ 'nav-icon__svg--open': isNavOpen }"
          width="76" 
          height="76" 
          viewBox="0 0 76 76" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            ref="path1Ref"
            :d="closedPaths[0]"
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"
          />
          <path 
            ref="path2Ref"
            :d="closedPaths[1]"
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"
          />
          <path 
            ref="path3Ref"
            :d="closedPaths[2]"
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round"
          />
        </svg>
      </button>
      <MiniCart @click="handleCartClick" />
    </div>
    </div>
    <CartModal :is-open="isCartOpen" @close="handleCartClose" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-beige);
  padding: 0.8rem 2rem;
  transform: translateY(0);
  transition: transform var(--transition);
  box-shadow: 0 2px 4px rgba(104, 76, 36, 0.4);

  &--hidden {
    transform: translateY(-100%);
  }

  &--open {
    background-color: var(--color-marron-dark);
    color: var(--color-beige);
    
    .header__nav-link {
      color: var(--color-beige);
    }
    
    .header__nav {
      opacity: 1;
      visibility: visible;
    }

    .header__logo {
      color: var(--color-beige);
    }
  }
  
  &__container {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--color-marron-dark);
    
    &-img {
      width: 120px;
      height: auto;
    }
    
    &-text {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }
    
    &-wood {
      font-family: 'Lovan', serif;
      font-size: 1.5rem;
      color: var(--color-marron);
    }
    
    &-kraft {
      font-family: 'Regarn', sans-serif;
      font-size: 1.2rem;
      color: var(--color-marron);
      font-weight: 400;
    }
  }

  .nav-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--color-marron-dark);
    animation: rotate 10s linear infinite;

    &:hover {
      animation-play-state: paused;
    }

    &--open {
      animation: none;
      color: var(--color-beige);
    }

    &__svg {
      width: 55px;
      height: 54px;
      transition: width var(--transition), height var(--transition);

      &--open {
        width: 76px;
        height: 76px;
      }
    }
  }

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

  .nav-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--color-marron-dark);
  }
  
  &__menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-marron);
    
    @media (max-width: 768px) {
      display: block;
    }
  }
  
  &__nav {
    display: flex;
    gap: 2rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: opacity var(--transition), visibility var(--transition), transform var(--transition);
    
    &--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &__nav-link {
    font-family: 'Regarn', sans-serif;
    font-size: 1.3rem;
    color: var(--color-marron-dark);
    text-decoration: none;
    font-weight: normal;
    transition: opacity var(--transition);
    
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

