import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Préférer localhost (pas 127.0.0.1) : même « famille » que le navigateur sur localhost:5173 pour les cookies.
  const backendTarget = env.VITE_DEV_BACKEND_URL || 'http://localhost:8000'

  return {
  plugins: [
    vue(),
    vueDevTools(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/scss/_variables.scss" as *;`
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  /**
   * Quand VITE_API_BASE_URL est relative (`/api/v1`), le navigateur appelle le même host que Vite.
   * Sans proxy, `/api/*` n’existe pas sur :5173 → 404. On relaie vers Laravel (`php artisan serve`).
   *
   * - changeOrigin: true + target sur localhost:8000 → Host cohérent avec le cookie « localhost ».
   * - cookieDomainRewrite: false → retire l’attribut Domain des Set-Cookie renvoyés par Laravel ; le
   *   navigateur associe alors le cookie à l’hôte courant (localhost:5173) au lieu de 127.0.0.1.
   */
  server: {
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: false,
      },
      '/sanctum': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: false,
      },
    },
  },
  }
})
