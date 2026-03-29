import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  })

  // Synchroniser Lenis avec le ticker GSAP
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Synchroniser Lenis avec ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  return lenis
}

export function destroySmoothScroll() {
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
  gsap.ticker.remove(() => {})
}

export function getLenis() {
  return lenis
}

export function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1, ...options })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function useSmoothScroll() {
  onMounted(() => {
    if (!lenis) initSmoothScroll()
  })

  onUnmounted(() => {
    destroySmoothScroll()
  })

  return { lenis: getLenis, scrollTo }
}
