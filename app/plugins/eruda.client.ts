export default defineNuxtPlugin(() => {
  const isDev = import.meta.dev
  const hasDebugParam = typeof window !== 'undefined' && window.location.search.includes('debug=true')

  if (isDev || hasDebugParam) {
    import('eruda').then(({ default: eruda }) => eruda.init())
  }
})
