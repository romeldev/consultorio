<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm text-center">
      <div class="text-5xl mb-4">🏥</div>
      <h1 class="text-2xl font-bold mb-1">Consultorio</h1>
      <p class="text-gray-500 text-sm mb-8">Sistema de gestión médica</p>

      <button
        class="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="handleSignIn"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        {{ loading ? 'Iniciando sesión...' : 'Continuar con Google' }}
      </button>

      <p v-if="error" class="text-red-600 text-xs mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, authReady, signIn } = useAuth()
const loading = ref(false)
const error = ref('')

onMounted(() => {
  console.log('[Login] montado — user:', user.value?.email ?? 'null', '| authReady:', authReady.value)
  watch([user, authReady], ([u, ready]) => {
    console.log('[Login] watch — user:', u?.email ?? 'null', '| ready:', ready)
    if (ready && u) navigateTo('/')
  }, { immediate: true })
})

const handleSignIn = async () => {
  loading.value = true
  error.value = ''
  try {
    await signIn()
  } catch (e: any) {
    console.error('[Login] error:', e?.code, e?.message)
    if (e?.code === 'auth/popup-blocked') {
      error.value = 'El popup fue bloqueado. Permite popups para este sitio e intenta de nuevo.'
    } else if (e?.code !== 'auth/cancelled-popup-request') {
      error.value = `Error: ${e?.code ?? e?.message}`
    }
  } finally {
    loading.value = false
  }
}
</script>
