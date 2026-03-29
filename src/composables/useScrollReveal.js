import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal() {
  const triggers = []

  function revealFrom(targets, vars = {}, scrollTriggerVars = {}) {
    const defaults = { opacity: 0, duration: 0.9, ease: 'power3.out' }
    const stDefaults = { start: 'top 85%', toggleActions: 'play none none none' }

    const tl = gsap.from(targets, {
      ...defaults,
      ...vars,
      scrollTrigger: { trigger: targets, ...stDefaults, ...scrollTriggerVars },
    })
    triggers.push(tl.scrollTrigger)
    return tl
  }

  function revealStagger(targets, vars = {}, scrollTriggerVars = {}) {
    const defaults = { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.12 }
    const stDefaults = { start: 'top 85%', toggleActions: 'play none none none' }

    const tl = gsap.from(targets, {
      ...defaults,
      ...vars,
      scrollTrigger: { trigger: targets, ...stDefaults, ...scrollTriggerVars },
    })
    triggers.push(tl.scrollTrigger)
    return tl
  }

  onUnmounted(() => {
    triggers.forEach(t => t?.kill())
  })

  return { revealFrom, revealStagger }
}
