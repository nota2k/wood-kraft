import './assets/scss/_main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useSessionStore } from './stores/session'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const session = useSessionStore()
  await session.hydrate()

  app.use(router)
  app.mount('#app')
}

bootstrap()
