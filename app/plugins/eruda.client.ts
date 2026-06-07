export default defineNuxtPlugin(() => {
  import('eruda').then(({ default: eruda }) => eruda.init())
})
