export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/pill-app/',
  },
  nitro: {
    prerender: { crawlLinks: true },
  },
  css: ['~/assets/css/main.css'],
})