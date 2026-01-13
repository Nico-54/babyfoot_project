// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 1. Force le moteur Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  // 2. Module Nuxt UI (qui inclut Tailwind)
  modules: ['@nuxt/ui', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15'
})