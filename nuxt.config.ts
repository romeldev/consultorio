// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  ssr: false,

  app: {
    baseURL: '/consultorio/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Consultorio',
    },
  },

  devtools: { enabled: true },
})
